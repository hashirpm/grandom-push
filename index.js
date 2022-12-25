
const PushAPI = require("@pushprotocol/restapi");
const ethers = require("ethers");
const axios = require("axios");
require('dotenv').config();


    const PK = process.env.PRIVATE_KEY; // channel private key
    const Pkey = `0x${PK}`;
    const signer = new ethers.Wallet(Pkey);
    var get_repo = async (language, page) => {
        console.log("fetching...");

        try {
            const url =
                "https://api.github.com/search/repositories?per_page=1&page=" +
                page +
                "&q=topic:" +
                language;
            response = await axios.get(url);
            return response.data.items[0];
        } catch (e) {
            console.log(e.message);
        }


    };

    const sendNotification = async () => {
        try {
            const page = Math.floor(Math.random() * 999) + 1;

            const repo = await get_repo("blockchain", page);
            // apiResponse?.status === 204, if sent successfully!
            const apiResponse = await PushAPI.payloads.sendNotification({
                signer,
                type: 1, // broadcast
                identityType: 2, // direct payload
                notification: {
                    title: `Random Blockchain Github Repository`,
                    body: repo.name
                },
                payload: {
                    title: repo.name,
                    body: repo.description + '\nFind the repository here: ' + repo.html_url,
                    cta: repo.html_url,
                    img: ''
                },
                channel: 'eip155:5:0x76898B621771ecF8025E612E7e289Fff1EfB51e4', // your channel address
                env: 'staging'
            });

            // apiResponse?.status === 204, if sent successfully!
            //console.log('API repsonse: ', apiResponse);
        } catch (err) {
            console.error('Error: ', err);
        }
    }
    sendNotification();

