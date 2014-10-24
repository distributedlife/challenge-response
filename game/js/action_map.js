module.exports = {
	input: {
		'space': [{target: 'controller', func: 'anykey', keypress: true}]
	},
	acks: {
		'show-challenge': [{target: 'controller', func: 'challenge_seen'}]
	}
};