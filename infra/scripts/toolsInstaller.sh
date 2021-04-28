#!/bin/bash

function installDocker {
    echo "Installing Docker..."
    {   # DEBIAN
        sudo apt-get -y update;
        sudo apt-get -y install apt-transport-https ca-certificates curl gnupg lsb-release;
        curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg;
        
        echo \
            "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
            $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null;
        
        sudo apt-get -y update;
        sudo apt-get -y install docker-ce docker-ce-cli containerd.io;
    } \
    || \
    {   # UBUNTU
        sudo apt-get -y update;
        sudo apt-get -y install apt-transport-https ca-certificates curl gnupg lsb-release;
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg;

        echo \
        "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null;

        sudo apt-get -y update;
        sudo apt-get -y install docker-ce docker-ce-cli containerd.io;
    } \
    || \
    {   # CENTOS
        sudo yum -y update;
        sudo yum install -y yum-utils;
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo;
        sudo yum -y update;
        sudo yum -y install docker-ce docker-ce-cli containerd.io;
    }
}

function installMinikube {
    echo "Installing Minikube..."
    {
        curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64          # BINARY INSTALL
        sudo install minikube-linux-amd64 /usr/local/bin/minikube
    } \
    || \
    ( 
        curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube_latest_amd64.deb     # DEBIAN PACKAGE
        sudo dpkg -i minikube_latest_amd64.deb
    ) \
    || \
    (
        curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-latest.x86_64.rpm    # RPM PACKAGE
        sudo rpm -ivh minikube-latest.x86_64.rpm
    )
}