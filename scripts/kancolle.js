// Description:
//
//
// Commands:
//   遠征に出発しました。帰投予定時刻 yyyy-MM-dd HH:mm:ss - 帰投予定時刻にメッセージを送信
//   remind mission end at yyyy-MM-dd HH:mm - 帰投予定時刻にメッセージを送信

'use strict';

const hubotSlack = require('hubot-slack');

module.exports = (robot) => {

	robot.listeners.push(new hubotSlack.SlackBotListener(robot, /^遠征に出発しました。帰投予定時刻 /i, (res) => {
		const message = res.message.text;
		let remindAt = message.substring('遠征に出発しました。帰投予定時刻 '.length);
		remindAt = remindAt.split(' ').map(val => val.trim()).filter(val => val !== '');

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

		remind(res, remindAt);
	}));

	robot.hear(/(^remind mission end at )/i, (res) => {

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

		remind(res, remindAt);
	});
};

function remind(res, remindAt) {

	const remindTime = remindAt.getTime();
	const now = new Date().getTime();
	const diff = remindTime - now;

	if (diff < 0) {
		res.send('受理できず... (過去日付)');
		return;
	}

	setTimeout((r) => {
		r.send('遠征から帰ってくる艦隊があるよ。');
	}, diff, res);

	res.send('帰ってきたら通知します。');
}
