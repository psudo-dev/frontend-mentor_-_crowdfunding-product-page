import "../css/index.css";
import { initCampaignPage } from "./render-campaign";
import { setupListeners } from "./setup-listeners";
import { setupMenu } from "./setup-menu";

await initCampaignPage();
setupMenu();
setupListeners();
