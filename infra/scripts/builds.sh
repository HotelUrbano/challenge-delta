function buildApp {
    # MOVE DOCKER CONFIG FILE TO AUTHENTICATION
    mkdir -p ~/.docker/
    cp ../docker/dockerconfig.json ~/.docker/config.json
    docker login
    
    # DOCKER BUILD AND PUSH
    VERSION=`date +%s`
    docker build -t crfluiz/challenge-delta:latest -t crfluiz/challenge-delta:${VERSION} -f ../docker/app.Dockerfile ../../application/
    docker push crfluiz/challenge-delta:latest
    docker push crfluiz/challenge-delta:${VERSION}
}