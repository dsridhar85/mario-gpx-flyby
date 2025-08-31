{
  "name": "React GPX Mario Flyby",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    }
  },
  "customizations": {
    "vscode": {
      "settings": {
        "terminal.integrated.defaultProfile.linux": "bash"
      },
      "extensions": [
        "dbaeumer.vscode-eslint"
      ]
    }
  },
  "postCreateCommand": "npm install"
}
