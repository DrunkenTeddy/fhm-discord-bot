const testButton                   = require("./buttons/testButton");
const adminAwardsCeremony          = require("./buttons/adminAwardsCeremony");
const adminAwardsNominationPhase   = require("./buttons/adminAwardsNominationPhase");
const adminAwardsVotingPhase       = require("./buttons/adminAwardsVotingPhase");
const adminDraftEnd                = require("./buttons/adminDraftEnd");
const adminDraftMockPublish        = require("./buttons/adminDraftMockPublish");
const adminDraftRollback           = require("./buttons/adminDraftRollback");
const adminDraftStart              = require("./buttons/adminDraftStart");
const adminLeagueAnnouncement      = require("./buttons/adminLeagueAnnouncement");
const adminRegisterGM              = require("./buttons/adminRegisterGM");
const adminSimDelete               = require("./buttons/adminSimDelete");
const adminSimNew                  = require("./buttons/adminSimNew");
const adminSimGenerate             = require("./buttons/adminSimGenerate");
const adminSimProcess              = require("./buttons/adminSimProcess");
const adminSimSchedule             = require("./buttons/adminSimSchedule");
const adminSimUpdate               = require("./buttons/adminSimUpdate");
const awardsNominationNext         = require("./buttons/awardsNominationNext");
const awardsNominationOpen         = require("./buttons/awardsNominationOpen");
const awardsNominationReset        = require("./buttons/awardsNominationReset");
const awardsNominationStart        = require("./buttons/awardsNominationStart");
const awardsVotePlayer             = require("./buttons/awardsVotePlayer");
const awardsVoteTeam               = require("./buttons/awardsVoteTeam");
const awardsVotingNext             = require("./buttons/awardsVotingNext");
const awardsVotingStart            = require("./buttons/awardsVotingStart");
const contractExtensionAccept      = require("./buttons/contractExtensionAccept");
const contractExtensionEdit        = require("./buttons/contractExtensionEdit");
const contractExtensionReject      = require("./buttons/contractExtensionReject");
const helpCommands                 = require("./buttons/helpCommands");
const helpDiscordBot               = require("./buttons/helpDiscordBot");
const newCSVUpload                 = require("./buttons/newCSVUpload");
const newInsiderInfo               = require("./buttons/newInsiderInfo");
const newPrediction                = require("./buttons/newPrediction");
const newTradeAddPickCondition     = require("./buttons/newTradeAddPickCondition");
const newTradeButton               = require("./buttons/newTrade");
const newTradeCancelPickCondition  = require("./buttons/newTradeCancelPickCondition");
const newTradeConfirmOffer         = require("./buttons/newTradeConfirmOffer");
const newTradeConfirmTeams         = require("./buttons/newTradeConfirmTeams");
const newTradeEdit                 = require("./buttons/newTradeEdit");
const newTradeRemovePickCondition  = require("./buttons/newTradeRemovePickCondition");
const newTradeResetTeams           = require("./buttons/newTradeResetTeams");
const notificationSettingsOpen     = require("./buttons/notificationSettingsOpen");
const notificationSettingsUpdate   = require("./buttons/notificationSettingsUpdate");
const offersheetSigningAcceptGM    = require("./buttons/offersheetSigningAcceptGM");
const offersheetSigningRejectGM    = require("./buttons/offersheetSigningRejectGM");
const openAdminPanel               = require("./buttons/openAdminPanel");
const openGMHub                    = require("./buttons/openGMHub");
const sendTestDM                   = require("./buttons/sendTestDM");
const showSimSchedule              = require("./buttons/showSimSchedule");
const showTeamLines                = require("./buttons/showTeamLines");
const showTeamStatLeaders          = require("./buttons/showTeamStatLeaders");
const simRecapBestTeamRecords      = require("./buttons/simRecapBestTeamRecords");
const simRecapReportCard           = require("./buttons/simRecapReportCard");
const simRecapStatLeaders          = require("./buttons/simRecapStatLeaders");
const simRecapSummary              = require("./buttons/simRecapSummary");
const simRecapWorstTeamRecords     = require("./buttons/simRecapWorstTeamRecords");
const staffSigningAccept           = require("./buttons/staffSigningAccept");
const staffSigningEdit             = require("./buttons/staffSigningEdit");
const staffSigningReject           = require("./buttons/staffSigningReject");
const syncDatabase                 = require("./buttons/syncDatabase");
const tradeAccept                  = require("./buttons/tradeAccept");
const tradeAcceptGM                = require("./buttons/tradeAcceptGM");
const tradeReject                  = require("./buttons/tradeReject");
const tradeRejectGM                = require("./buttons/tradeRejectGM");

const adminDraftRollbackModal       = require("./modals/adminDraftRollback");
const adminLeagueAnnouncementModal  = require("./modals/adminLeagueAnnouncement");
const adminRegisterGMModal          = require("./modals/adminRegisterGM");
const adminSimNewModal              = require("./modals/adminSimNew");
const adminSimUpdateModal           = require("./modals/adminSimUpdate");
const awardNominationModal          = require("./modals/awardNominationModal");
const contractExtensionEditModal    = require("./modals/contractExtensionEditModal");
const newInsiderInfoModal           = require("./modals/newInsiderInfoModal");
const newPredictionModal            = require("./modals/newPrediction");
const newTradeAddPickConditionModal = require("./modals/newTradeAddPickCondition");
const newTradeOffer                 = require("./modals/newTradeOffer");
const staffSigningEditModal         = require("./modals/staffSigningEditModal");
const tradeOffer                    = require("./modals/tradeOffer");

const adminRegisterGMSelect              = require("./select/adminRegisterGM");
const adminSimDeleteSelect               = require("./select/adminSimDelete");
const adminSimUpdateSelect               = require("./select/adminSimUpdate");
const newTradeAddPickConditionSelect     = require("./select/newTradeAddPickConditionSelect");
const newTradeRemovePickConditionSelect  = require("./select/newTradeRemovePickConditionSelect");
const newTradeUpdateTeams                = require("./select/newTradeUpdateTeams");
const predictionCloseWinnerSelect        = require("./select/predictionCloseWinner");

const closePredictionContextMenu = require("./contextmenu/closePrediction");
const gmHubContextMenu           = require("./contextmenu/showGMHub");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isAutocomplete()) {
      // AUTOCOMPLETE
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.isChatInputCommand()) {
      // COMMANDS
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        // Log command usage
        console.log(`[${Date.now()}] ${interaction.user.tag} used command ${interaction.commandName} in ${interaction.channel.name} on ${interaction.guild.name}`);

        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
      }
    } else if (interaction.isButton()) {
      // BUTTONS
      console.log(`[${Date.now()}] ${interaction.user.tag} used button ${interaction.customId}`);

      if (interaction.customId === "test") {
        await testButton(interaction);
      } else if (interaction.customId === "trade-accept") {
        await tradeAccept(interaction);
      } else if (interaction.customId === "trade-reject") {
        await tradeReject(interaction);
      } else if (interaction.customId === "contract-extension-accept") {
        await contractExtensionAccept(interaction);
      } else if (interaction.customId === "contract-extension-reject") {
        await contractExtensionReject(interaction);
      } else if (interaction.customId === "contract-extension-edit") {
        await contractExtensionEdit(interaction);
      } else if (interaction.customId === "staff-signing-accept") {
        await staffSigningAccept(interaction);
      } else if (interaction.customId === "staff-signing-reject") {
        await staffSigningReject(interaction);
      } else if (interaction.customId === "staff-signing-edit") {
        await staffSigningEdit(interaction);
      } else if (interaction.customId.startsWith("os-gm-accept")) {
        await offersheetSigningAcceptGM(interaction);
      } else if (interaction.customId.startsWith("os-gm-reject")) {
        await offersheetSigningRejectGM(interaction);
      } else if (interaction.customId.startsWith("trade-accept-gm")) {
        await tradeAcceptGM(interaction);
      } else if (interaction.customId.startsWith("trade-reject-gm")) {
        await tradeRejectGM(interaction);
      } else if (interaction.customId.startsWith("sim-recap-team-report-card")) {
        await simRecapReportCard(interaction);
      } else if (interaction.customId.startsWith("sim-recap-summary")) {
        await simRecapSummary(interaction);
      } else if (interaction.customId.startsWith("sim-recap-goals")) {
        await simRecapStatLeaders(interaction, "goals");
      } else if (interaction.customId.startsWith("sim-recap-assists")) {
        await simRecapStatLeaders(interaction, "assists");
      } else if (interaction.customId.startsWith("sim-recap-points")) {
        await simRecapStatLeaders(interaction, "points");
      } else if (interaction.customId.startsWith("sim-recap-best-teams")) {
        await simRecapBestTeamRecords(interaction);
      } else if (interaction.customId.startsWith("sim-recap-worst-teams")) {
        await simRecapWorstTeamRecords(interaction);
      } else if (interaction.customId.startsWith("send-test-dm")) {
        await sendTestDM(interaction);
      } else if (interaction.customId.startsWith("new-trade-reset-teams")) {
        await newTradeResetTeams(interaction);
      } else if (interaction.customId.startsWith("new-trade-confirm-teams")) {
        await newTradeConfirmTeams(interaction);
      } else if (interaction.customId.startsWith("new-trade-add-pick-condition")) {
        await newTradeAddPickCondition(interaction);
      } else if (interaction.customId.startsWith("new-trade-remove-pick-condition")) {
        await newTradeRemovePickCondition(interaction);
      } else if (interaction.customId.startsWith("new-trade-cancel-pick-condition")) {
        await newTradeCancelPickCondition(interaction);
      } else if (interaction.customId.startsWith("new-trade-confirm-offer")) {
        await newTradeConfirmOffer(interaction);
      } else if (interaction.customId.startsWith("new-trade-edit")) {
        await newTradeEdit(interaction);
      } else if (interaction.customId.startsWith("send-new-trade")) {
        await newTradeButton(interaction);
      } else if (interaction.customId.startsWith("send-new-insider-info")) {
        await newInsiderInfo(interaction);
      } else if (interaction.customId.startsWith("help-discord-bot")) {
        await helpDiscordBot(interaction, interaction.customId.endsWith("-update"));
      } else if (interaction.customId.startsWith("help-commands")) {
        await helpCommands(interaction, interaction.customId.endsWith("-update"));
      } else if (interaction.customId.startsWith("view-team-stat-leaders")) {
        await showTeamStatLeaders(interaction);
      } else if (interaction.customId.startsWith("view-sim-schedule")) {
        await showSimSchedule(interaction);
      } else if (interaction.customId.startsWith("view-team-lines")) {
        await showTeamLines(interaction);
      } else if (interaction.customId.startsWith("open-gm-hub")) {
        await openGMHub(interaction, true);
      } else if (interaction.customId.startsWith("return-gm-hub")) {
        await openGMHub(interaction);
      } else if (interaction.customId.startsWith("awards-nomination-start")) {
        await awardsNominationStart(interaction);
      } else if (interaction.customId.startsWith("awards-nomination-open")) {
        await awardsNominationOpen(interaction);
      } else if (interaction.customId.startsWith("awards-nomination-reset")) {
        await awardsNominationReset(interaction);
      } else if (interaction.customId.startsWith("awards-nomination-next") || interaction.customId.startsWith("awards-nomination-skip")) {
        await awardsNominationNext(interaction);
      } else if (interaction.customId.startsWith("awards-voting-start")) {
        await awardsVotingStart(interaction);
      } else if (interaction.customId.startsWith("awards-voting-next")) {
        await awardsVotingNext(interaction);
      } else if (interaction.customId.startsWith("awards-vote-player")) {
        await awardsVotePlayer(interaction);
      } else if (interaction.customId.startsWith("awards-vote-team")) {
        await awardsVoteTeam(interaction);
      } else if (interaction.customId.startsWith("notification-settings-open")) {
        await notificationSettingsOpen(interaction);
      } else if (interaction.customId.startsWith("notification-settings-update")) {
        await notificationSettingsUpdate(interaction);
      } else if (interaction.customId.startsWith("admin-cancel")) {
        await openAdminPanel(interaction);
      } else if (interaction.customId.startsWith("admin-sim-cancel")) {
        await adminSimSchedule(interaction);
      } else if (interaction.customId.startsWith("admin-register-gm")) {
        await adminRegisterGM(interaction);
      } else if (interaction.customId.startsWith("admin-sim-schedule")) {
        await adminSimSchedule(interaction);
      } else if (interaction.customId.startsWith("admin-sim-new")) {
        await adminSimNew(interaction);
      } else if (interaction.customId.startsWith("admin-sim-update")) {
        await adminSimUpdate(interaction);
      } else if (interaction.customId.startsWith("admin-sim-generate")) {
        await adminSimGenerate(interaction);
      } else if (interaction.customId.startsWith("admin-sim-delete")) {
        await adminSimDelete(interaction);
      } else if (interaction.customId.startsWith("admin-awards-start-nomination")) {
        await adminAwardsNominationPhase(interaction);
      } else if (interaction.customId.startsWith("admin-awards-start-voting")) {
        await adminAwardsVotingPhase(interaction);
      } else if (interaction.customId.startsWith("admin-awards-end-voting")) {
        await adminAwardsCeremony(interaction);
      } else if (interaction.customId.startsWith("admin-draft-start")) {
        await adminDraftStart(interaction);
      } else if (interaction.customId.startsWith("admin-draft-end")) {
        await adminDraftEnd(interaction);
      } else if (interaction.customId.startsWith("admin-draft-rollback")) {
        await adminDraftRollback(interaction);
      } else if (interaction.customId.startsWith("admin-draft-mock-publish")) {
        await adminDraftMockPublish(interaction);
      } else if (interaction.customId.startsWith("admin-sim-run")) {
        await adminSimProcess(interaction);
      } else if (interaction.customId.startsWith("admin-league-announcement")) {
        await adminLeagueAnnouncement(interaction);
      } else if (interaction.customId.startsWith("prediction-new")) {
        await newPrediction(interaction);
      } else if (interaction.customId.startsWith("new-csv-upload")) {
        await newCSVUpload(interaction);
      } else if (interaction.customId.startsWith("sync-database")) {
        await syncDatabase(interaction);
      }
    } else if (interaction.isModalSubmit()) {
      // MODALS
      if (interaction.customId.startsWith("new-trade-offer")) {
        await newTradeOffer(interaction);
      } else if (interaction.customId.startsWith("new-trade-add-pick-condition")) {
        await newTradeAddPickConditionModal(interaction);
      } else if (interaction.customId.startsWith("trade-offer")) {
        await tradeOffer(interaction);
      } else if (interaction.customId.startsWith("send-new-insider-info-modal")) {
        await newInsiderInfoModal(interaction);
      } else if (interaction.customId.startsWith("contract-extension-edit")) {
        await contractExtensionEditModal(interaction);
      } else if (interaction.customId.startsWith("staff-signing-edit")) {
        await staffSigningEditModal(interaction);
      } else if (interaction.customId.startsWith("award-nomination")) {
        await awardNominationModal(interaction);
      } else if (interaction.customId.startsWith("admin-register-gm")) {
        await adminRegisterGMModal(interaction);
      } else if (interaction.customId.startsWith("admin-sim-new")) {
        await adminSimNewModal(interaction);
      } else if (interaction.customId.startsWith("admin-sim-update")) {
        await adminSimUpdateModal(interaction);
      } else if (interaction.customId.startsWith("admin-league-announcement")) {
        await adminLeagueAnnouncementModal(interaction);
      } else if (interaction.customId.startsWith("prediction-new")) {
        await newPredictionModal(interaction);
      } else if (interaction.customId.startsWith("admin-draft-rollback")) {
        await adminDraftRollbackModal(interaction);
      }
    } else if (interaction.isStringSelectMenu()) {
      // SELECT MENUS
      console.log(`[${Date.now()}] ${interaction.user.tag} used select menu ${interaction.customId}`);

      if (interaction.customId.startsWith("new-trade-add-teams")) {
        await newTradeUpdateTeams(interaction);
      } else if (interaction.customId.startsWith("new-trade-add-pick-condition")) {
        await newTradeAddPickConditionSelect(interaction);
      } else if (interaction.customId.startsWith("new-trade-remove-pick-condition")) {
        await newTradeRemovePickConditionSelect(interaction);
      } else if (interaction.customId.startsWith("admin-register-gm")) {
        await adminRegisterGMSelect(interaction);
      } else if (interaction.customId.startsWith("admin-sim-update")) {
        await adminSimUpdateSelect(interaction);
      } else if (interaction.customId.startsWith("admin-sim-delete")) {
        await adminSimDeleteSelect(interaction);
      } else if (interaction.customId.startsWith("prediction-close-winner")) {
        await predictionCloseWinnerSelect(interaction);
      }
    } else if (interaction.isUserContextMenuCommand()) {
      // USER CONTEXT MENU
      console.log(`[${Date.now()}] ${interaction.user.tag} used context menu "${interaction.commandName}"`);

    } else if (interaction.isMessageContextMenuCommand()) {
      // MESSAGE CONTEXT MENU
      console.log(`[${Date.now()}] ${interaction.user.tag} used context menu "${interaction.commandName}"`);

      if (interaction.commandName === "My GM Hub") {
        await gmHubContextMenu(interaction);
      } else if (interaction.commandName === "Close Prediction") {
        await closePredictionContextMenu(interaction);
      }
    }
  },
};
