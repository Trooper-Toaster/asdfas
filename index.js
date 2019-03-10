const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const ms = require("ms");
const fs = require("fs");
let cooldown = new Set();
let cdseconds = 1;
let kicks = JSON.parse(fs.readFileSync("./kicks.json", "utf8"));
let cions = require("./coins.json",);
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
const ytdl = require("ytdl-core");
const bot = new Discord.Client({disableEveryone: true});
bot.on("ready", async () => {
  console.log(`${bot.user.username} is online`);
  bot.user.setGame("with the Breeze Dev Team");
});
bot.commands = new Discord.Collection();

global.servers = {};



bot.on("message", async message=> {
  let blacklisted = [`pex`, `noob`, `raid`];
  let foundInText = false;
  for (var i in blacklisted){
    if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;

  }
  if (foundInText){
    message.delete();
    message.channel.send("Cant say that");
  };
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
if(cooldown.has(message.author.id)){
  message.delete();
  message.reply("Woah, slow down!").then(msg => msg.delete(5000));
}
cooldown.add(message.author.id);
  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args,ops);

  setTimeout(() => {
    cooldown.delete(message.author.id)
  }, cdseconds * 1000)

if(cmd ===`${prefix}serverinfo`){
  let sicon = message.guild.displayAvatarURL;
  let serverinbed = new Discord.RichEmbed()
  .setDescription("Server Info")
  .setColor("#5fe00f")
  .setThumbnail(sicon)
  .addField("Server Name", message.guild.name)
  .addField("You Joined", message.member.joinedAt)
  .addField("Total Members", message.guild.memberCount);

  return message.channel.send(serverinbed);
}

if(cmd ===`${prefix}poll`){
  if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send('You need to be an admin fool');
  if(!args[0]) return message.channel.send("Useage: <prefix>poll question");

  let party = new Discord.RichEmbed()
  .setColor(0xffffff)
  .setFooter("React to vote")
  .setDescription(args.join(' '))
  .setTitle  (`Poll asked by ${message.author.username}`)


let msg = await message.channel.send(party);

  await msg.react('✅');
  await msg.react('🚫');
message.delete();
  return;
}




if(cmd ===`${prefix}tempmute`){
let muteduser = message.mentions.members.first() || message.guild.members.get(args[0]);
if(!muteduser) return message.reply("Cant find them!");
let muterole = message.guild.find(`name`, "Muted");

  return;
}
if(cmd === `${prefix}kick`){
let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!kUser) return message.channel.send("Cant Find user");
let kreason = args.join(" ").slice(22);
if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Nope");
if(kUser.hasPermission("KICK_MEMBERS")) return message.channel.send("Cant Kick other Mods");

if(!kicks[kUser.id]) kicks[kUser.id] = {
 kicks: 0
};

kicks[kUser.id].kicks++;
fs.writeFile("./kicks.json", JSON.stringify(kicks), (err) =>{
if (err) console.log(err);
});
if(kicks[kUser.id].kicks == 3){
  message.guild.member(kUser).ban(kreason);
  message.channel.send(`${kuser.name} has been banned for 3 kicks!`)
}

let kickEmbed = new Discord.RichEmbed()
.setDescription("Kick")
.setColor("#e09d0e")
.addField("Kicked User", `${kUser} with ID ${kUser.id}`)
.addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
.addField("Time", message.createdAt)
.addField("Kicked in", message.channel)
.addField("Reason", kreason);

let kickChannel = message.guild.channels.find(`name`, "modlog")
if(!kickChannel) return message.channel.send("Cant Find the ModLog")

message.guild.member(kUser).kick(kreason);
kickChannel.send(kickEmbed);
kUser.sendMessage(`You have been kicked for ${kreason}`);


  return;
}
if(cmd === `${prefix}warns`){
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Nope");
  let jUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  message.reply("If nothing is responded, then they have 0 warnings");
  if(!jUser) return message.reply("Cant find them");
  let warnlevel = warns[jUser.id].warns
  message.reply(`They have ${warnlevel} warnings`)

}
if(cmd === "toaster"){
message.channel.send("is the best scripter")

  return;
}
if(cmd === `${prefix}warn`){
if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry, can't do that");
let iUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!iUser) return message.reply("Cant find them");

if(!warns[iUser.id]) warns[iUser.id] = {
 warns: 0
};

warns[iUser.id].warns + 1;
fs.writeFile("./warnings.json", JSON.stringify(warns), (err) =>{
if (err) console.log(err);
});

let ireason = args.join(" ").slice(22);
if(!ireason) return message.reply("Reason please");
let warnEmbed = new Discord.RichEmbed()
.setDescription("Warn")
.setColor("#e8f442")
.addField("Warned User", `${iUser} with ID ${iUser.id}`)
.addField("Warned By", `<@${message.author.id}> with ID ${message.author.id}`)
.addField("Time", message.createdAt)
.addField("Warned in", message.channel)
.addField("Reason", ireason);

let warnChannel = message.guild.channels.find(`name`, "modlog");
if(!warnChannel) return message.channel.send("Cant Find the ModLog");

message.channel.send("User has been Warned!");
warnChannel.send(warnEmbed);
iUser.sendMessage(`You have been warned for ${ireason}`);


if(!warns[iUser.id]) warns[iUser.id] = {
 warns: 0
};

warns[iUser.id].warns++;
fs.writeFile("./warnings.json", JSON.stringify(warns), (err) =>{
if (err) console.log(err);
});

if(warns[iUser.id].warns == 3){
  message.guild.member(iUser).kick(ireason);
  message.channel.send(`${iUser.name} has been kicked for 3 warns!`)
}

}
if(cmd === "trooper"){
message.channel.send("is the best player")

  return;
}



if(cmd === "bangles"){
message.channel.send("is the best begger")

  return;
}
if(cmd === "mark"){
message.channel.send("wants me to do this")

  return;
}
if(cmd === `${prefix}verify`){
  let tfRoles = message.guild.roles.find(`name`, "Member");
  let tfRole = message.guild.roles.find(`name`, "unverified");
  await(message.author.addRole(gRole.id));
  message.delete();
  message.author.removeRole(tfRole.id);


  return;
}
if(cmd === `${prefix}cmds`){
message.channel.send("Kick, Ban, Warn, Language, Clear, AddRole, RemoveRole, Role Lock, serverinfo, and botinfo")
  return;
}

if(cmd === `${prefix}mute`){
let eqUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!eqUser) return message.channel.send("Cant Find user");
if(!message.member.hasPermission("KICK_MEMBERS")) return message.send("Nice Try");


return;
}
if(cmd === `${prefix}language`){
  let lUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!lUser) return message.channel.send("Cant Find user");
  if(!message.member.hasPermission("KICK_MEMBERS")) return message.send("Nice Try");
let fwarnEmbed = new Discord.RichEmbed()
.setDescription("Language Violation")
.setColor("#e8f442")
.addField("Busted by", `${lUser} with ID ${lUser.id}`)
.addField("Busted For", `<@${message.author.id}> with ID ${message.author.id}`)
.addField("Time", message.createdAt)
.addField("Busted in", message.channel)


let warnfChannel = message.guild.channels.find(`name`, "modlog")
if(!warnfChannel) return message.channel.send("Cant Find the ModLog")

message.channel.send("User has been noted for a language violation!");
warnfChannel.send(fwarnEmbed);
lUser.sendMessage(`You have been warned for a language violation in ${message.channel}, please remember that children play this game and should not be exposed to it`);
return;
}

if(cmd ===`${prefix}lock`){
  if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(`Hello`);
  let role = args[0];
  let lereason = args.join(" ").slice(22);
  if(!role) return message.reply("What Role?");
  let jRole = message.guild.roles.find(`name`, role);
  message.channel.overwritePermissions(jRole, {
  SEND_MESSAGES: false
});
let ewarnEmbed = new Discord.RichEmbed()
.setDescription("Role Lock")
.setColor("#e8f442")
.addField("Locked By",  `<@${message.author.id}> with ID ${message.author.id}`)
.addField("Locked", args[0])
.addField("Time", message.createdAt)



let ewarnfChannel = message.guild.channels.find(`name`, "modlog")
if(!ewarnfChannel) return message.channel.send("Cant Find the ModLog")
ewarnfChannel.send(ewarnEmbed);
message.channel.send(`**The role ${jRole.name} has been locked by an admin**`);

  return;
}
bot.on('guildMemberAdd', member =>{
var role = member.guild.roles.find(`name`, `unverified`);
  member.addRole(role);
  console.log("Player added and roled");


});
if(cmd ===`${prefix}unlock`){
  if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(`Hello`);
  let role = args[0]
  if(!role) return message.reply("What Role?");
  let ejRole = message.guild.roles.find(`name`, role);
  message.channel.overwritePermissions(ejRole, {
  SEND_MESSAGES: true
});
let qewarnEmbed = new Discord.RichEmbed()
.setDescription("Role Unlock")
.setColor("#e8f442")
.addField("Unlocked By",  `<@${message.author.id}> with ID ${message.author.id}`)
.addField("Unlocked", args[0])
.addField("Time", message.createdAt)



let eewarnfChannel = message.guild.channels.find(`name`, "modlog")
if(!eewarnfChannel) return message.channel.send("Cant Find the ModLog")
eewarnfChannel.send(qewarnEmbed);
message.channel.send(`**The role ${ejRole.name} has been unlocked by an admin**`);



  return;
}

if(cmd === `${prefix}addrole`){
if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Nope");
let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!rMember) return message.reply("Role a Member");
let role = args.join(" ").slice(22);
if(!role) return message.reply("What Role?");
let gRole = message.guild.roles.find(`name`, role);
if(!gRole) return message.reply("How bout a role that is real?");

if(rMember.roles.has(gRole.id)) return message.reply("They already have that role!");
await(rMember.addRole(gRole.id));


let froleimbed = new Discord.RichEmbed()
  .setDescription("Added Role")
  .setColor("#f4a142")
  .addField("Time", message.createdAt)
  .addField("Roled", rMember)
  .addField("Role", gRole)
  .addField("By", message.author);

  let frole = message.guild.channels.find(`name`, "modlog");
  if(!frole) return message.channel.send("Cant Find the ModLog");
 frole.send(froleimbed);
 message.channel.send(`Roled ${rMember} the ${gRole.name} Role`);

  return;
}
if(cmd === `${prefix}removerole`){
if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Nope");
let qMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
if(!qMember) return message.reply("Role a Member");
let role = args.join(" ").slice(22);
if(!role) return message.reply("What Role?");
let tRole = message.guild.roles.find(`name`, role);
if(!tRole) return message.reply("How bout a role that is real?");

if(qMember.roles.has(tRole.id));
await(qMember.removeRole(tRole.id));


let roleimbed = new Discord.RichEmbed()
  .setDescription("Removed Role")
  .setColor("#f4a142")
  .addField("Time", message.createdAt)
  .addField("Who", qMember)
  .addField("Removed", tRole)
  .addField("By", message.author);

  let frole = message.guild.channels.find(`name`, "modlog");
  if(!frole) return message.channel.send("Cant Find the ModLog");
 frole.send(roleimbed);
 message.channel.send(`Removed ${qMember} ${tRole.name} Role`);


  return;
}
if(cmd === `${prefix}ban`){
let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!bUser) return message.channel.send("Cant Find user");
let breason = args.join(" ").slice(22);
if(!message.member.hasPermission("BAN_MEMBERS")) return message.send("Nice Try")
if(bUser.hasPermission("BAN_MEMBERS")) return message.channel.send("Can't ban other Mods")

let banembed = new Discord.RichEmbed()
.setDescription("Ban")
.setColor("#e09d0e")
.addField("Banned User", `${bUser} with ID ${bUser.id}`)
.addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
.addField("Time", message.createdAt)
.addField("Banned in", message.channel)
.addField("Reason", breason);

let kickChannel = message.guild.channels.find(`name`, "modlog")
if(!kickChannel) return message.channel.send("Cant Find the ModLog")

message.guild.member(bUser).ban(breason);
kickChannel.send(banembed);
bUser.sendMessage(`You have been warned for ${breason}`);



  return;
}



if(cmd ===`${prefix}clear`){
if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Nope");
if(!args[0]) return message.channel.send("Specify a Number").then(msg => msg.delete(5000));
if(!args[1]) return message.channel.send("Specify a Reason!").then(msg => msg.delete(5000));
message.channel.bulkDelete(args[0]).then(() => {

  let clearembed = new Discord.RichEmbed()
  .setDescription("Clear")
  .setColor("#e09d0e")
  .addField("Cleared by", message.author)
  .addField("Cleared", args[0])
  .addField("Reason", args[1])
  .addField("Time", message.createdAt);



  message.channel.send("10-4").then(msg => msg.delete(5000));
  message.guild.channels.find(`name`, "modlog").send(clearembed);
})



};
  //say Hello
  if(cmd ===`${prefix}botinfo`){
    let bicon = bot.user.displayAvatarURL;
    let botinbed = new Discord.RichEmbed()
    .setDescription("Bot Infomation")
    .setColor("#d8261a")
    .setThumbnail(bicon)
    .addField("Bot Name", bot.user.username)
    .addField("Created On", bot.user.createdAt);

    return message.channel.send(botinbed);
  }
});





bot.login(botconfig.token);
