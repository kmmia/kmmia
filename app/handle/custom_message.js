module.exports = function ({
    api,
    config,
    __GLOBAL,
    User,
    Thread,
    Rank,
    Economy,
    Fishing,
    Nsfw,
    Image
}) {
    function getText(...args) {
        const langText = __GLOBAL.language.event;
        const getKey = args[0];
        if (!langText.hasOwnProperty(getKey)) throw `${__filename} - Not found key language: ${getKey}`;
        let text = langText[getKey];
        for (let i = args.length; i > 0; i--) {
            let regEx = RegExp(`%${i}`, 'g');
            text = text.replace(regEx, args[i]);
        }
        return text;
    }

    const fs = require('fs-extra');
    const eval = require("eval");
    const axios = require('axios');

    const request = require('request');

    return async function ({
        event
    }) {
        let {
            threadID,
            messageID,
            senderID,
            body
        } = event;
        const admins = config.admins;

        senderID = parseInt(senderID);
        threadID = parseInt(threadID);
        if (__GLOBAL.userBlocked.includes(senderID) && !admins.includes(senderID) || __GLOBAL.threadBlocked.includes(threadID) && !admins.includes(senderID)) return;

        const pf = config.prefix;
        //Do code here
        if (!fs.existsSync(__dirname + '/src/checktt.json')) fs.writeFileSync(__dirname + '/src/checktt.json', JSON.stringify({}));
        const checkttdata = JSON.parse(fs.readFileSync(__dirname + '/src/checktt.json'));
        if (!checkttdata[threadID]) checkttdata[threadID] = {};
        if (!checkttdata[threadID][senderID]) checkttdata[threadID][senderID] = 0;
        checkttdata[threadID][senderID] += 1;
        fs.writeFileSync(__dirname + '/src/checktt.json', JSON.stringify(checkttdata));

        if (body.indexOf(`${pf}gang`) == 0) {
            let content = body.split(' ');
            var storage = [];
            var rankdata = JSON.parse(fs.readFileSync(__dirname + '/src/checktt.json'));
            for (i of Object.keys(rankdata)) {
                let total = 0;
                for (e of Object.keys(rankdata[i])) {
                    total += rankdata[i][e];
                }
                storage.push({
                    id: i,
                    score: total
                });
                storage.sort((a, b) => {
                    if (a.score > b.score) return -1;
                    if (a.score < b.score) return 1;
                    if (a.id > b.id) return 1;
                    if (a.id < b.id) return -1;
                });
            }
            if (!content[1]) {
                let msg = '=======GANG=======';
                let gangInfo = await api.getThreadInfo(threadID);
                let name = '\nName: ' + gangInfo.name;
                let mem = '\nMembers: ' + gangInfo.participantIDs.length;
                const rank = storage.findIndex(info => parseInt(info.id) == parseInt(threadID)) + 1;
                const gangdata = storage[rank - 1];
                msg += name + mem + '\nScore: ' + gangdata.score + '\nRank: ' + rank;
                api.sendMessage(msg, threadID);
            } else if (content[1] == 'all') {
                let msg = '=======GANGS=======\n',
                    number = 0;
                for (e of storage) {
                    let name = (await api.getThreadInfo(e.id)).name
                    number += 1;
                    msg += number + '. ' + name + ' với ' + e.score + ' điểm.\n';
                }
                api.sendMessage(msg, threadID);
            } else api.sendMessage('Sai format', threadID);
        }

        if (body.indexOf(`${pf}checktt`) == 0 || body.indexOf(`${pf}check`) == 0) {
            let content = body.split(' ');
            let data = JSON.parse(fs.readFileSync(__dirname + '/src/checktt.json'));
            let getInfo = await api.getThreadInfo(threadID);
            var uinfo = getInfo.userInfo;
            var storage = [];
            for (i of uinfo) {
                if (!data[threadID][i.id]) data[threadID][i.id] = 0;
                storage.push({
                    id: i.id,
                    name: i.name,
                    count: data[threadID][i.id]
                });
            }
            storage.sort((a, b) => {
                if (a.count > b.count) return -1;
                if (a.count < b.count) return 1;
                if (a.id > b.id) return 1;
                if (a.id < b.id) return -1;
            });
            if (!content[1]) {
                const rank = storage.findIndex(info => parseInt(info.id) == parseInt(senderID)) + 1;
                const infoUser = storage[rank - 1];
                api.sendMessage(`Bạn đứng hạng ${rank} với ${infoUser.count} tin nhắn`, threadID, messageID);
            } else if (content[1] == 'all') {
                var number = 0,
                    msg = "";
                for (const lastData of storage) {
                    number++;
                    msg += `${number}. ${lastData.name} với ${lastData.count} tin nhắn \n`;
                }
                api.sendMessage(msg, threadID);
            } else {
                let mention = Object.keys(event.mentions);
                if (mention[0]) {
                    const rank = storage.findIndex(info => parseInt(info.id) == parseInt(mention[0])) + 1;
                    const infoUser = storage[rank - 1];
                    api.sendMessage(`${infoUser.name} đứng hạng ${rank} với ${infoUser.count} tin nhắn`, threadID, messageID);
                } else return api.sendMessage('Sai cú pháp :b', threadID)
            }
            return;
        }

        if (body == `${pf}`) {
            let dny = ["Bạn đã biết.", "Dũng là một thằng ấu dâm.", "Đùi là chân lý.", "Gái gú chỉ là phù du, loli mới là bất diệt.", "DũngUwU là một thằng nghiện loli.", "Bạn đang thở.", "Tú rất dâm.", "Trái đất hình vuông.", "Kẹo sữa Milkita được làm từ sữa.", "Chim cánh cụt có thể bay.", "Trong quá trình hình thành phôi, tế bào tim đầu tiên bắt đầu đập từ tuần thứ 4.", "Hãy thử bóp một quả bóng tennis, nó giống với công việc trái tim phải làm mỗi ngày để bơm máu đi khắp cơ thể.", "Cho đến 6 - 7 tháng tuổi, một đứa trẻ có thể thở và nuốt cùng lúc. Tuy nhiên, người lớn thì không có khả năng này.", "Nếu bạn sống đến 70 tuổi, bạn sẽ trải qua 10 năm của những ngày thứ Hai.", "Năm 1962, một bệnh dịch tiếng cười nổ ra ở Tanzania. Nó nắm quyền kiểm soát hơn 1.000 người và diễn ra trong vòng 18 tháng.", "Độ phân giải của đôi mắt chúng ta lên đến khoảng 576 triệu điểm ảnh", "Vào buổi sáng sau khi thức dậy, chiều cao của chúng ta sẽ nhỉnh hơn so với ban tối vào khoảng 1cm.", "Một khối vuông xương có thể chịu được sức nặng đến hơn 8 tấn, và độ cứng thì hơn cả sắt.", "Nhịp tim của chúng ta có thể tự đồng bộ hóa với bài hát đang nghe.", "Apple được thành lập vào đúng ngày cá tháng tư.", "Ngôn ngữ lập trình JavaScript được ra đời từ năm 1995 bởi nhà khoa học máy tính Brendan Eich, có biệt hiệu Mocha.", "Định dạng file nén ZIP được Phillip Katz phát minh lần đầu tiên vào năm 1986.", "Chiếc điện thoại kèm màn hình cảm ứng đầu tiên trên thế giới được ra mắt vào năm 1992, với tên gọi IBM Simon.", "Chuẩn kết nối Bluetooth được đặt theo tên một vị vua người Đan Mạch.", "Tin nhắn SMS đầu tiên được gửi thông qua mạng viễn thông GSM Vodafrone của Anh vào ngày 3/12/1992.", "Emoticons (các biểu tượng cảm xúc) lần đầu tiên được Scott Fahlman, một nhà khoa học máy tính tại Đại học Carnegie Mellon, sử dụng vào ngày 19/9/1982.", "Chuột máy tính đầu tiên làm bằng gỗ.", "Năm 1910, chiếc tai nghe đầu tiên trên thế giới được Nathaniel Baldwin phát minh ra trong nhà bếp của mình ở bang Utah (Mỹ).", 'Lỗi máy tính hay còn được gọi với cái tên "Bug" được đặt tên theo nghĩa đen của lỗi máy tính đầu tiên.', "Wi-Fi là một từ không có nghĩa."];
            api.sendMessage('[Bạn có biết?]:' + dny[Math.floor(Math.random() * dny.length)], threadID, messageID);
        }

        if (body == `${pf}loli`) {
            let name = (await api.getUserInfo(senderID))[senderID].name;
            axios.get("https://www.api-adreno.tk/loli").then(get => {
                let type = get.data.url.substring(get.data.url.lastIndexOf(".") + 1);
                var nameFile = get.data.url.slice(get.data.url.lastIndexOf("/") + 1, -4)
                let callback = function () {
                    if (type == "jpg" || type == "gif" || type == "jpg" || type == "png") {
                        type = type
                    } else type = "mp4";
                    api.sendMessage({
                        body: name + ", loli của bạn đây UwU!",
                        mentions: [{
                            tag: name,
                            id: senderID
                        }],
                        attachment: fs.createReadStream(__dirname + `/media/${nameFile}.${type}`)
                    }, threadID, () => fs.unlinkSync(__dirname + `/media/${nameFile}.${type}`), messageID);
                };
                request(get.data.url).pipe(fs.createWriteStream(__dirname + `/media/${nameFile}.${type}`)).on("close", callback);
            })
        }

        if (body == `${pf}rest`) {
            if (config.admins.includes(parseInt(senderID))) {
                return api.sendMessage("Bot sẽ khởi động lại ngay lập tức!", threadID, () => eval("module.exports = process.exit(1)", true), messageID);
            } else return api.sendMessage('bạn không phải admin bot :)', threadID, messageID);
        }


        if (body.indexOf(`${pf}box`) == 0) {
            let a = body.slice(0, 4);
            if (a.length == body.length) return api.sendMessage(`Bạn có thể dùng:\n${pf}box emoji [icon]\n\n${pf}box name [tên box cần đổi]\n\n${pf}box image [rep một ảnh bất kì cần đặt thành ảnh box]\n\n${pf}box admin [tag] => nó sẽ đưa qtv cho người được tag\n\n${pf}box info => Toàn bộ thông tin của nhóm ! 
      `, threadID, messageID);

            if (body.slice(5, 9) == "name") {
                var content = body.slice(10, body.length);
                var c = content.slice(0, 99) || event.messageReply.body;
                api.setTitle(`${c } `, threadID);
            }

            if (body.slice(5, 10) == "emoji") {
                a = body.split(" ");
                const name = a[2] || event.messageReply.body;
                api.sendMessage(a[2], threadID, () =>
                    api.changeThreadEmoji(name, threadID))
            }

            if (body.slice(5, 7) == "me") {
                if (body.slice(8, 13) == "admin") {
                    const threadInfo = await api.getThreadInfo(threadID)
                    const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
                    if (!find) api.sendMessage("BOT cần ném quản trị viên để dùng ?", threadID, messageID)
                    else if (!config.admins.includes(senderID)) api.sendMessage("Quyền hạn lồn ?", threadID, messageID)
                    else api.changeAdminStatus(threadID, senderID, true);
                }
            }

            if (body.slice(5, 10) == "admin") {
                if (body.slice(5, body.length).join().indexOf('@') !== -1) {
                    namee = Object.keys(event.mentions)
                } else return api.sendMessage('tag ai đó?', threadID, messageID);
                if (event.messageReply) {
                    namee = event.messageReply.senderID
                }

                const threadInfo = await api.getThreadInfo(threadID)
                const findd = threadInfo.adminIDs.find(el => el.id == namee);
                const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
                const finddd = threadInfo.adminIDs.find(el => el.id == senderID);

                if (!finddd) return api.sendMessage("Mày đéo phải quản trị viên box ?", threadID, messageID);
                if (!find) {
                    api.sendMessage("Không ném quản trị viên dùng con cặc ?", threadID, messageID)
                }
                if (!findd) {
                    api.changeAdminStatus(threadID, namee, true);
                } else api.changeAdminStatus(threadID, namee, false)
            }

            if (body.slice(5, 10) == "image") {
                if (event.type !== "message_reply") return api.sendMessage("❌ Bạn phải reply một audio, video, ảnh nào đó", threadID, messageID);
                if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("❌ Bạn phải reply một audio, video, ảnh nào đó", threadID, messageID);
                if (event.messageReply.attachments.length > 1) return api.sendMessage(`Vui lòng reply chỉ một audio, video, ảnh!`, threadID, messageID);
                var callback = () => api.changeGroupImage(fs.createReadStream(__dirname + "/src/boximg.png"), threadID, () => fs.unlinkSync(__dirname + "/src/boximg.png"));
                return request(encodeURI(event.messageReply.attachments[0].url)).pipe(fs.createWriteStream(__dirname + '/src/boximg.png')).on('close', () => callback());
            };
            if (body.slice(5, 9) == "info") {
                var threadInfo = await api.getThreadInfo(threadID);
                let threadMem = threadInfo.participantIDs.length;
                var gendernam = [];
                var gendernu = [];
                var nope = [];
                for (let z in threadInfo.userInfo) {
                    var gioitinhone = threadInfo.userInfo[z].gender;
                    var nName = threadInfo.userInfo[z].name;

                    if (gioitinhone == 'MALE') {
                        gendernam.push(z + gioitinhone);
                    } else if (gioitinhone == 'FEMALE') {
                        gendernu.push(gioitinhone);
                    } else {
                        nope.push(nName);
                    }
                }
                var nam = gendernam.length;
                var nu = gendernu.length;
                let qtv = threadInfo.adminIDs.length;
                let sl = threadInfo.messageCount;
                let icon = threadInfo.emoji;
                let threadName = threadInfo.threadName;
                let id = threadInfo.threadID;
                var listad = '';
                var qtv2 = threadInfo.adminIDs;
                for (let i = 0; i < qtv2.length; i++) {
                    const infu = (await api.getUserInfo(qtv2[i].id));
                    const name = infu[qtv2[i].id].name;
                    listad += '•' + name + '\n';
                }
                let sex = threadInfo.approvalMode;
                var pd = sex == false ? 'tắt' : sex == true ? 'bật' : 'Kh';
                var pdd = sex == false ? '❎' : sex == true ? '✅' : '⭕';
                var callback = () =>
                    api.sendMessage({
                            body: `Tên box: ${threadName}\nID Box: ${id}\n${pdd} Phê duyệt: ${pd}\nEmoji: ${icon}\n-Thông tin:\nTổng ${threadMem} thành viên\n👨‍🦰Nam: ${nam} thành viên \n👩‍🦰Nữ: ${nu} thành viên\n\n🕵️‍♂️Với ${qtv} quản trị viên gồm:\n${listad}\nTổng số tin nhắn: ${sl} tin.`,
                            attachment: fs.createReadStream(__dirname + '/src/1.png')
                        },
                        threadID,
                        () => fs.unlinkSync(__dirname + '/src/1.png'),
                        messageID
                    );
                return request(encodeURI(`${threadInfo.imageSrc}`))
                    .pipe(fs.createWriteStream(__dirname + '/src/1.png'))
                    .on('close', () => callback());
            }
        }
        if (body.indexOf(`${pf}speedtest`) == 0) {
            try {
                const fast = require("fast-speedtest-api");
                const speedTest = new fast({
                    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
                    verbose: false,
                    timeout: 10000,
                    https: true,
                    urlCount: 5,
                    bufferSize: 8,
                    unit: fast.UNITS.Mbps
                });
                const resault = await speedTest.getSpeed();
                return api.sendMessage(
                    "=== Result ===" +
                    "\n- Speed: " + Math.floor(resault) + " Mbps",
                    threadID, messageID
                );
            } catch {
                return api.sendMessage("Không thể speedtest ngay lúc này, hãy thử lại sau!", threadID, messageID);
            }
        }

        if (body.indexOf(`${pf}ghep`) == 0) {
            Economy.getMoney(senderID).then(async (money) => {
                if (money < 500) return api.sendMessage("Bạn cần 500 đô!", threadID, messageID);
                else {
                    var tle = Math.floor(Math.random() * 101);
                    var userData = (await api.getUserInfo(senderID))[senderID];
                    var name = userData.name || "Bạn";
                    let threadInfo = await api.getThreadInfo(threadID);
                    var all = threadInfo.participantIDs.filter(ID => ID != senderID);;
                    var id = all[Math.floor(Math.random() * all.length)];
                    var userDataRandom = (await api.getUserInfo(id))[id];
                    var namee = userDataRandom.name || "Người ấy";
                    var arraytag = [];
                    arraytag.push({
                        id: senderID,
                        tag: name
                    });
                    arraytag.push({
                        id: id,
                        tag: namee
                    })

                    let Avatar = (await axios.get(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`, {
                        responseType: "arraybuffer"
                    })).data;
                    fs.writeFileSync(__dirname + "/media/avt.png", Buffer.from(Avatar, "utf-8"));
                    let Avatar2 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?height=720&width=720&access_token=170440784240186|bc82258eaaf93ee5b9f577a8d401bfc9`, {
                        responseType: "arraybuffer"
                    })).data;
                    fs.writeFileSync(__dirname + "/media/avt2.png", Buffer.from(Avatar2, "utf-8"));
                    var imglove = [];
                    imglove.push(fs.createReadStream(__dirname + "/media/avt.png"));
                    imglove.push(fs.createReadStream(__dirname + "/media/avt2.png"));
                    var msg = {
                        body: `🐳Ghép đôi thành công!\n💞Tỉ lệ hợp đôi: ${tle}%\n${name} 💓 ${namee}`,
                        mentions: arraytag,
                        attachment: imglove
                    }
                    Economy.subtractMoney(senderID, 500);
                    return api.sendMessage(msg, threadID, messageID)
                }
            });
        }
    }
}