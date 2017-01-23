/*
ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: "357253634613504",
  loginStyle: "popup",
  secret: "f88070e10ca7af3060326342bfc6c5e3"
});

/*
ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  { $set: { clientId: "357253634613504", secret: "f88070e10ca7af3060326342bfc6c5e3" } }
);*/
/*
Accounts.config({
  sendVerificationEmail: true});
*/