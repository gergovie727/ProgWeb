# Comment accéder à l'application ?

## Installer docker et minikube

Pour installer docker et minikube, nous vous invitons à vous référer aux sites officiels:

- Docker: https://docs.docker.com/get-docker/
- Minikube: https://minikube.sigs.k8s.io/docs/start/

## Installer l'application

1) Lancer minikube:
> minikube start

2) Se placer dans le répertoir.

3) Appliquer le fichier de configuration
> kubectl apply -f front-back-app.yml

4) Récupérer l'adresse IP du cluster
> minikube ip

5) Rentrer cette IP dans la barre d'adresse.
