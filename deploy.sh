#!/bin/bash

# Env Vars
REPO_URL="https://github.com/ANNchannean/pos.git"  
# Script Vars"
REPO_DIR=~/
SWAP_SIZE="1G"  # Swap size of 1GB

# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Add Swap Space
echo "Adding swap space..."
sudo fallocate -l $SWAP_SIZE /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab



# Change to the repository directory
cd "$REPO_DIR" || exit 1
# Clone the repository
if [ ! -d "$REPO_DIR" ]; then
  echo "Cloning repository..."
  git clone "$REPO_URL" "$REPO_DIR"
else
  echo "Repository already exists. Skipping clone."
fi


# Install Docker (if not already installed)
if ! command -v docker &> /dev/null; then
  echo "Docker not found. Installing Docker..."

# For Debian/Ubuntu:
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture signed-by=/usr/share/keyrings/docker-archive-keyring.gpg)] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
# Ensure Docker starts on boot and start Docker service

echo "Docker installation complete."

# Add user to docker group (so you don't need sudo for docker commands)
sudo usermod -aG docker $USER
newgrp docker # Apply the group change without logging out
sudo systemctl enable docker
sudo systemctl start docker

else
  echo "Docker already installed. Skipping installation."
fi

# Run Docker Compose
echo "Starting Docker Compose..."
docker compose up -d

echo "Docker Compose started."
# Set your repository URL and desired directory
