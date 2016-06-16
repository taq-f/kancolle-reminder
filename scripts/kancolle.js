// Description:
//
//
// Commands:
//   遠征に出発しました。帰投予定時刻 yyyy-MM-dd HH:mm:ss - 帰投予定時刻にメッセージを送信
//   remind mission end at yyyy-MM-dd HH:mm - 帰投予定時刻にメッセージを送信

'use strict';

const hubotSlack = require('hubot-slack');

module.exports = (robot) => {

	robot.listeners.push(new hubotSlack.SlackBotListener(robot, /遠征に出発しました。帰投予定時刻 /i, (res) => {
		const message = res.message.text;
		const replyTo = message.substring(0, res.match.index);
		const timeString = message.substring(res.match[0].length + res.match.index);
		let remindAt = timeString.split(' ').map(val => val.trim()).filter(val => val !== '');

		const date = remindAt[0].split('-');
		const time = remindAt[1].split(':');
		remindAt = date.concat(time);

		remindAt = new Date(
			remindAt[0],
			remindAt[1] - 1,
			remindAt[2],
			remindAt[3],
			remindAt[4],
			remindAt[5]
		);

		const remindTime = remindAt.getTime();
		const now = new Date().getTime();
		const diff = remindTime - now;

		if (diff < 0) {
			res.send(replyTo + '受理できず... (過去日付)');
			return;
		}

		setTimeout((r, to, t) => {
			r.send(to + '遠征から艦隊が帰ってきたよ。' + t);
		}, diff, res, replyTo, timeString);

		res.send(replyTo + '帰ってきたら通知します。');
	}));

	robot.hear(/^remind mission end /i, (res) => {

		const message = res.message.text;
		let remindAt = message.substring('remind mission end at '.length);
		remindAt = remindAt.split(' ').map(val => val.trim()).filter(val => val !== '');
		const date = remindAt[0].split('-');
		const time = remindAt[1].split(':');
		remindAt = date.concat(time);

		remindAt = new Date(
			remindAt[0],
			remindAt[1] - 1,
			remindAt[2],
			remindAt[3],
			remindAt[4]
		);

		const remindTime = remindAt.getTime();
		const now = new Date().getTime();
		const diff = remindTime - now;

		if (diff < 0) {
			res.reply('受理できず... (過去日付)');
			return;
		}

		setTimeout((r) => {
			r.reply('遠征から帰ってくる艦隊があるよ。');
		}, diff, res);

		res.reply('帰ってきたら通知します。');
	});
};
