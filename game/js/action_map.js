module.exports = {
	input: {
		'space': [{target: 'controller', func: 'anykey', keypress: true}],
		'r': [{target: 'controller', func: 'reset', keypress: true}]
	},
	acks: {
		'show-challenge': [{target: 'controller', func: 'challenge_seen'}]
	}
};