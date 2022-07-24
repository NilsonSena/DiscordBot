const Discord = require('discord.js');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGES"] });

const { DisTube } = require("distube");

const distube = new DisTube(client, {
    searchSongs: 10,
    searchCooldown: 30,
    leaveOnEmpty: false,
    leaveOnFinish: false,
    leaveOnStop: false,
    
})
const prefix = "'";

const config = {
    token: "ODk3MjIwNzMxMjgzMzI1MDI4.YWSf6w.sNi1Hkn-Ut6HT3g_mqX_Fcpx8ew",
}

client.once('ready', () => {
    console.log('MuseCaly is online');
});


client.on("messageCreate", message =>{
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    //Comandos para o Bot
    if((command === ("p")) || (command === ("play"))){
        if(!message.member.voice.channel) return message.textChannel.send('Você não está em um chat de voz!');
        if(!args[0]) return message.textChannel.send('Você precisar colocar algo para tocar!');
        distube.play(message, args.join(" "));
        
    }

    if(command === "stop"){
        const bot = message.guild.members.cache.get(client.user.id);
        if(!message.member.voice.channel) return message.textChannel.send('Você não está em um chat de voz!');
        if(!bot.voice.channel !== message.member.voice.channel) return message.textChannel.send('Você não está no mesmo chat de voz do Bot!');
        distube.stop(message);
        message.textChannel.send('Você parou a musica!');
    }

    if (command === "queue") {
        const queue = distube.getQueue(message)
        if (!queue) {
            message.channel.send("Nada tocando agora!")
        } else {
            message.channel.send(`Queue atual:\n${queue.songs.map((song, id) => `**${id ? id : "Tocando"}**. ${song.name} - \`${song.formattedDuration}\``).slice(0, 10).join("\n")}`
            )
        }
    }


    //if (command === "skip") distube.skip(message)
    
/*
    
    if (command === "skip") {

        const queue = distube.getQueue(message)
        if (!queue){

            message.channel.send("Não existem musicas a serem tocadas. Adicione alguma!");
        
        }else{
            if (!Queue.autoplay && Queue.song.length <= 1){
                distube.skip(message);
            }else{
                distube.stop(message);
            }
        }
        
    }
*/

    if (command === "skip") {
        
        const queue = distube.getQueue(message)
        
        if (!queue){
            message.channel.send("Não existem musicas a serem tocadas. Adicione alguma!");
        }else{
            if (queue.autoplay || queue.songs.length > 1){
                distube.skip(message);
            }else{
                distube.stop(message);
                message.channel.send("Fim da lista, adicione mais músicas!");
            }  
        }
    }

    if (command === "resume") distube.resume(message)

    if (command === "pause") distube.pause(message)


    if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(command)) {
        const filter = distube.setFilter(message, command)
        message.channel.send(`Current queue filter: ${filter.join(", ") || "Off"}`)
    }
});   

//Status da Queue de musicas
const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Repeat: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "Essa Musica" : "Off"}`;


//Listeners para mandar mensagens dependendo do
distube
    .on("playSong", (queue, song) => queue.textChannel.send(
        `Tocando \`${song.name} - \`${song.formattedDuration}\`\nSolicitado por: ${song.user.tag}\n${status(queue)}`
    ))
    
    .on("addSong", (queue, song) => queue.textChannel.send(
        `Adicionando \`${song.name} - \`${song.formattedDuration}\` a lista por ${song.user.tag}`
    ))
    
    .on("playList", (queue, playlist, song) => queue.textChannel.send(
        `Tocando as musicas da playlist \`${playlist.name}\` (${playlist.songs.length} ).\nSolicitado por: ${song.user.tag}\nTocando agora \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
    ))

    .on("addList", (queue, playlist) => queue.textChannel.send(
        `Adicionando a playlist \`${playlist.name}\` (${playlist.songs.length} musicas) a lista\n${status(queue)}` 
    ))
    
    .on("error", (message, e) => {
        console.error(e)
        message.textChannel.send("Um erro foi encontrado: " + e);
    })
    


//Login é a ultima coisa que deve estar no codigo
client.login(config.token)