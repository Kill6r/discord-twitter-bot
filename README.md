# Discord Social Network Bot

A Discord bot inspired by Twitter/X, built with **JavaScript**, **Node.js** and **Discord.js v14**.

This project allows users to create social profiles, publish posts, follow other users and interact inside a Discord server through slash commands, embeds and Discord components.

## 🚀 Features

- User profile system
- Create and view posts
- Follow and unfollow system
- Public profile visualization
- Twitter/X-style social interaction inside Discord
- Slash command support
- Modular command handler
- Event handler
- Discord.js v14 support
- MongoDB/Mongoose models structure
- Custom configuration with YAML files
- Utility modules
- Clean and scalable folder structure

## 🧩 Main Systems

### Profile System

Users can create and manage their own profile inside Discord.

Possible profile information:

- Username
- Bio
- Avatar
- User data
- Social information
- Created posts
- Following system

### Posts System

Users can create posts similar to tweets inside Discord.

Post features can include:

- Text posts
- Post embeds
- User mentions
- Post history
- Profile-related posts
- Stored post data

### Follow System

The bot includes a social follow system where users can follow or unfollow other users inside the Discord server.

### Slash Commands

The project supports slash commands for a modern Discord bot experience.

Example commands:

```txt
/createprofile
/profile
/seguir
/dejarseguir
/help
/botinfo
```

## 🛠️ Technologies

- JavaScript
- Node.js
- Discord.js v14
- Discord API
- MongoDB / Mongoose
- YAML
- npm
- Git & GitHub

## 📁 Project Structure

```txt
DiscordJS v14 [ES]/
├── comandos/
│   └── Administracion/
│       ├── prefix.js
│       └── setcolor.js
├── configs/
│   ├── config.yml
│   └── messages.yml
├── database/
│   ├── Models/
│   │   ├── Guild.js
│   │   ├── Posts.js
│   │   └── Twitter.js
│   ├── connect.js
│   └── schema.txt
├── eventos/
│   ├── client/
│   │   └── ready.js
│   └── guild/
│       ├── interactionCreate.js
│       └── messageCreate.js
├── handlers/
│   ├── comandos.js
│   ├── eventos.js
│   └── slash.js
├── images/
│   └── twitter.png
├── Modules/
│   ├── CreateCommands.js
│   └── Utils.js
├── slashs/
│   ├── Informacion/
│   ├── Utilidad/
│   ├── botinfo.js
│   ├── createcommand.js
│   ├── createprofile.js
│   ├── dejarseguir.js
│   ├── help.js
│   ├── profile.js
│   └── seguir.js
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/discord-social-network-bot.git
```

Go to the project folder:

```bash
cd discord-social-network-bot
```

Install dependencies:

```bash
npm install
```

Configure your bot token and database connection.

Example configuration:

```yml
BOT_TOKEN: "YOUR_BOT_TOKEN"
CLIENT_ID: "YOUR_CLIENT_ID"
MONGO_URI: "YOUR_MONGODB_CONNECTION"
```

Start the bot:

```bash
node app.js
```

## 🔐 Security

Before using or publishing this project, make sure you do **not** upload private information such as:

- Discord bot tokens
- MongoDB connection URLs
- Client data
- Server IDs from private clients
- User data
- Webhooks

Use example configuration files instead of real credentials.

## 📌 Use Cases

This project can be used as a base for:

- Discord social network bots
- Twitter/X-style bots inside Discord
- Community profile systems
- Post systems
- Follow systems
- Server interaction tools
- Custom Discord communities

## 👨‍💻 About the Developer

Developed by **Kill6r**.

I am a JavaScript developer with experience creating Discord, Telegram and WhatsApp bots, API integrations, automation systems, ticket systems, mini-games, survey systems and custom tools for online communities.

## 📄 License

This project is licensed under the MIT License.
