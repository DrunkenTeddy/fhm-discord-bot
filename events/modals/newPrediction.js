const { ActionRowBuilder, ButtonBuilder } = require("@discordjs/builders");
const { ButtonStyle, EmbedBuilder }       = require("discord.js");

module.exports = async (interaction) => {
  const question = interaction.fields.getTextInputValue("prediction-question");
  const option1  = interaction.fields.getTextInputValue("prediction-option-1");
  const option2  = interaction.fields.getTextInputValue("prediction-option-2");
  const option3  = interaction.fields.getTextInputValue("prediction-option-3");
  const option4  = interaction.fields.getTextInputValue("prediction-option-4");

  let predictionMessage = "";

  if (option1 !== "" && option1 !== "None") {
    predictionMessage += `🇦 ${option1}\n`;
  }

  if (option2 !== "" && option2 !== "None") {
    predictionMessage += `🇧 ${option2}\n`;
  }

  if (option3 !== "" && option3 !== "None") {
    predictionMessage += `🇨 ${option3}\n`;
  }

  if (option4 !== "" && option4 !== "None") {
    predictionMessage += `🇩 ${option4}\n`;
  }

  predictionMessage += "\n**Make your prediction below ⬇️**";

  const predictionEmbed = new EmbedBuilder()
    .setTitle(question)
    .setDescription(predictionMessage);

  const channel = interaction.client.channels.cache.find((c) => c.name === "predictions");
  const message = await channel.send({
    embeds: [predictionEmbed],
  });

  if (option1 !== "" && option1 !== "None") {
    message.react("🇦");
  }

  if (option2 !== "" && option2 !== "None") {
    message.react("🇧");
  }

  if (option3 !== "" && option3 !== "None") {
    message.react("🇨");
  }

  if (option4 !== "" && option4 !== "None") {
    message.react("🇩");
  }

  await interaction.reply({
    content   : "Prediction created!",
    ephemeral : true,
  });
};
