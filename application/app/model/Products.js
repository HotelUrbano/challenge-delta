const { conn } = require('../../config/db');
const db = require('../../config/db');

class Products{
    async createConn(){
        try{
            const conn = await db.conn();
            return conn;
        }catch(e){
            console.log('CREATE CONNECTION ERROR IN DAO PRODUCT CLASS\n', e.message);
        }
    }

    formatToJoin(colName){
        if(colName == 'barcode') return 'product_barcode.barcode';
        if(colName == 'name' || colName == 'value') return `product_attribute.${colName}`;
        if(colName == 'productId') return 'product.product_id';
        return `product.${colName}`;
    }
     
    async getList(standards = {}, options = []){
        const conn = await this.createConn();
        const [ sql_select ] = options
            .filter(col => col.fields ? true : false)
            .map(col => (col['fields'] == 'productId') ? 'product_id' : col['fields'] )
            .map(col => col.map(name => this.formatToJoin(name)));

        const sql_where = options
            .filter(col => !col.fields ? true : false )
            .map(col => col['productId'] ? { product_id: col.productId } : col);
        let sql_query = `SELECT ${sql_select && sql_select.length > 0 ? sql_select.join(', ') : '*'} FROM product `;
        sql_query += `INNER JOIN product_barcode ON product.product_id=product_barcode.product_id ${sql_where.length > 0 ? 'WHERE ':''}`;
         
        sql_where.forEach((obj, idx) => {
            let prop = Object.keys(obj)[0];
            let col = this.formatToJoin(prop);
            sql_query += `${col}='${obj[prop]}' AND `;
            if(idx == sql_where.length - 1) sql_query = sql_query.substr(0, sql_query.length - 4);
        });
        
        sql_query += `LIMIT ${standards.num}`;
        try {
            const [ PRODS ] = await conn.query(sql_query);
            return PRODS;
        }catch(e){
            console.log(e.message);
            throw e;
        }
    }

    async getById(id, fields){
        const conn = await this.createConn();
        const newFields = fields.map(field => (field == "productId") ? "product_id" : field);
        const attr = newFields.includes("attributes");
        if(attr) newFields.splice(newFields.indexOf("attributes"));
        try{
            await conn.beginTransaction();
            const [ dataProd ] = await conn.query(`SELECT ${newFields && newFields.length > 0 ? newFields.join(',') : '*'} FROM product WHERE product_id=?`, [id]);
            let dataAttr = [];
            if(newFields.length == 0 || attr) [ dataAttr ] = await conn.query('SELECT name, value FROM product_attribute WHERE product_id=?', [id]);
            await conn.commit();
            await conn.end();
            const response = (newFields.length == 0 || attr) ? { ...dataProd[0], attributes: dataAttr } : { ...dataProd[0] };
            return response;
        }catch(e){
            console.log(e.message);
            return e;
        }
    }

    async saveProduct(obj){
        const dataQuery1 = [obj.title, obj.sku, obj.description, parseFloat(obj.price)];
        try{
            const conn = await this.createConn();
            await conn.beginTransaction();
            const [firstQuery] = await conn.query('INSERT INTO product (title, sku, description, price) values(?, ?, ?, ?)', dataQuery1);
            const dataQuery2 = [obj.barcodes.map(code => [firstQuery.insertId, code])];
            await conn.query('INSERT INTO product_barcode (product_id, barcode) values ?', dataQuery2);
            
            const dataQuery3 = [obj.attributes.map(attr => [firstQuery.insertId, attr.name, attr.value])];
            await conn.query('INSERT INTO product_attribute (product_id, name, value) values ?', dataQuery3);
            
            await conn.commit();
            await conn.end();

            return firstQuery.insertId;
            
        }catch(e){
            console.log("ERROR IN DAO PRODUCT CLASS\n", e.message);
            return e.message;
        }
    }

    async updateProduct(id, obj){
        const conn = await this.createConn();
        
        const col = Object.keys(obj);
        let attr = null, code = null;
        if(col.includes("attributes")){
            attr = obj.attributes;
            col.splice(col.indexOf("attributes"));
        }
        if(col.includes("barcodes")){
            code = obj.barcodes;
            col.splice(col.indexOf("barcodes"));
        }

        const data = col.map(colName => obj[colName]);
        data.push(parseInt(id));

        try{
            await conn.beginTransaction();
            const sql = `UPDATE product SET ${col.join('=?, ')}=? WHERE product_id=?`;
            const sql_code = code ? 'UPDATE product_barcode SET barcode = ? WHERE product_id = ?' : null;
            const sql_attr1 = attr ? 'DELETE FROM product_attribute WHERE product_id = ?' : null;
            const sql_attr2 = attr ? 'INSERT INTO product_attribute (product_id, name, value) values ?' : null;
            const data_attr2 = attr ? attr.map(attribute => [id, attribute.name, attribute.value]) : null;
            
            await conn.query(sql, data);
            if(code) await conn.query(sql_code, [code, id]);
            if(attr) await conn.query(sql_attr1, [id]);
            if(attr) await conn.query(sql_attr2, [data_attr2]);

            await conn.commit();
            await conn.end();

            return true;
        }catch(e){
            console.log(e.message);
            throw e;
        }
    }

    async deleteProduct(id){
        const conn = await this.createConn();
        try{
            await conn.beginTransaction();
            const [ EXISTS ] = await conn.query('SELECT * FROM product WHERE product_id=?', [id]);
            if(!EXISTS.length > 0){
                await conn.commit();
                await conn.end();
                return "Doesn't have product with the id sent";
            }
            await conn.query('DELETE FROM product_attribute WHERE product_id=?', [id]);
            await conn.query('DELETE FROM product_barcode WHERE product_id=?', [id]);
            await conn.query('DELETE FROM product WHERE product_id=?', [id]);
            await conn.commit();
            await conn.end();
        }catch(e){
            console.log(e.message);
            throw e;
        }
        return true;
    }
}
module.exports = Products;
