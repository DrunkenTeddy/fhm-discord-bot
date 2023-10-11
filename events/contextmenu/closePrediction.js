const { ActionRowBuilder }        = require("@discordjs/builders");
const { StringSelectMenuBuilder } = require("discord.js");

module.exports = async (interaction) => {
  const message         = interaction.targetMessage;
  const messageID       = message.id;
  const predictionEmbed = message.embeds[0];
  const isPrediction    = predictionEmbed.data.description.includes("Make your prediction below");

  if (isPrediction) {
    const predictionOptions = predictionEmbed.data.description.split("\n")
      .filter((option) => option.trim() !== "" && !option.includes("Make your prediction below"));

    const optionsSelectOptions = predictionOptions.map((option) => ({
      label : `${option.split(" ").slice(1).join(" ")}`,
      value : `${option}`,
      emoji : `${option.split(" ")[0]}`,
    }));

    const optionsSelect = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`prediction-close-winner-${messageID}`)
          .setPlaceholder("Select the winning option")
          .addOptions(optionsSelectOptions),
      );

    await interaction.reply({
      components : [optionsSelect],
      ephemeral  : true,
    });
  } else {
    await interaction.reply({
      content   : "This message is not a prediction or the prediction has already been closed.",
      ephemeral : true,
    });
  }
};
