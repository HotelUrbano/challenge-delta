# THIS SCRIPT HAS THE NEEDED FUNCTIONS TO DEPLOY K8S RESOURCES
 
function createMysql {
    minikube kubectl apply -- -f ../k8s/mysql.configmap.yml
    minikube kubectl create secret generic mysql-info -- --from-literal=root-password="${1:-"h0t3lhurb4n0"}" --from-literal=user="${2:-"hurb"}" --from-literal=password="${3:-"hurbP4SS"}"
    minikube kubectl apply -- -f ../k8s/mysql.pvc.yml
    minikube kubectl apply -- -f ../k8s/mysql.deployment.yml
    minikube kubectl apply -- -f ../k8s/mysql.service.yml
}

function deleteMysql {
    minikube kubectl delete -- -f ../k8s/mysql.configmap.yml
    minikube kubectl delete -- -f ../k8s/mysql.service.yml
    minikube kubectl delete -- -f ../k8s/mysql.deployment.yml
    minikube kubectl delete secret mysql-info
    minikube kubectl delete -- -f ../k8s/mysql.pvc.yml
}

function createApp {
    minikube kubectl apply -- -f ../k8s/app.deployment.yml
    minikube kubectl apply -- -f ../k8s/app.service.yml
    minikube kubectl apply -- -f ../k8s/app.hpa.yml
}

function deleteApp {
    minikube kubectl delete -- -f ../k8s/app.hpa.yml
    minikube kubectl delete -- -f ../k8s/app.service.yml
    minikube kubectl delete -- -f ../k8s/app.deployment.yml
}

function createNginx {
    minikube kubectl apply -- -f ../k8s/nginx.configmap.yml
    minikube kubectl apply -- -f ../k8s/nginx.deployment.yml
    minikube kubectl apply -- -f ../k8s/nginx.service.yml
}

function deleteNginx {
    minikube kubectl delete -- -f ../k8s/nginx.service.yml
    minikube kubectl delete -- -f ../k8s/nginx.deployment.yml
    minikube kubectl delete -- -f ../k8s/nginx.configmap.yml
}