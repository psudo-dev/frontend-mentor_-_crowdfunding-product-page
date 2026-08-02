import "../css/index.css";
import { initCampaignPage } from "./render-campaign";
import { setupListeners } from "./setup-listeners";
import { setupMenu } from "./setup-menu";

await initCampaignPage();
setupMenu();
setupListeners();

// import { setUserData } from "./data";

// const userData = {
// 	firstVisit: "2026-07-29T15:52:55.110Z",
// 	bookmarked: true,
// 	pledgesArr: [
// 		{
// 			id: "bamboo",
// 			amountArr: [25, 50, 25, 50],
// 		},
// 		{
// 			id: "no-reward",
// 			amountArr: [10, 1, 0, 8],
// 		},
// 		{
// 			id: "mahogany",
// 			amountArr: [200, 500],
// 		},
// 		{
// 			id: "black",
// 			amountArr: [100, 100, 75, 1000, 8000, 300],
// 		},
// 	],
// };

// setUserData(userData);
