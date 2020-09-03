default: help
.SILENT:

help:
	@@echo
	@@echo "Challenge-delta"
	@@echo
	@@echo "Please use 'make <parameters>'"
	@@echo
	@@echo "Parameters:"
	@@echo "  packages - install all packages you need"
	@@echo "  start - start minikube cluster"

packages:
	@echo install docker
	@curl -fsSL https://get.docker.com | sudo sh
	@sudo usermod -aG docker $USER

	@echo install kubectl
	@curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
	@chmod +x ./kubectl
	@sudo mv ./kubectl /usr/local/bin/kubectl
	@
	@echo install minikube
	@curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
	@sudo mkdir -p /usr/local/bin/
	@sudo install minikube /usr/local/bin/

start:
	@@echo Start minikube
	@@minikube start --driver=docker
	@@minikube addons enable ingress

deploy:
	@@echo "Build and deploy images"
	@@eval $(minikube docker-env)
	@@echo "Build db"
	@@docker build -t db:latest -f automate/docker/db/Dockerfile .
	@@echo "Build nodeapp"
	@@docker build -t nodeapp:latest -f automate/docker/nodeapp/Dockerfile .
	@@echo "Deploy hurb Challenge-delta"
	@@kubectl create -f automate/k8s/namespace.yml
	@@kubectl create -f automate/k8s/db.yml
	@@kubectl create -f automate/k8s/nodeapp.yml
	@@kubectl create -f automate/k8s/ingress.yml

destroy:
	@@echo "Destroy hurb Challenge-delta"
	@kubectl delete -f automate/k8s/namespace.yml
	@kubectl delete -f automate/k8s/db.yml
	@kubectl delete -f automate/k8s/nodeapp.yml
	@kubectl delete -f automate/k8s/ingress.yml