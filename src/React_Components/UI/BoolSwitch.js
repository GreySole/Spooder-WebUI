import React from 'react';

class BoolSwitch extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...props };
		this.toggleSwitch = this.toggleSwitch.bind(this);

        this.state.id = this.state.id || crypto.randomUUID()
	}

	toggleSwitch = e => {
		let thisSwitch = e.target.closest('.boolswitch');

		if (e.target.checked == false) {
			thisSwitch.classList.remove('checked');
		} else {
			thisSwitch.classList.add('checked');
		}
		this.state.onChange(e);
	};

	render() {
		return (
			<label className={this.state.checked ? 'boolswitch checked' : 'boolswitch'} htmlFor={`bool-${this.state.id}`}>
                {this.state.label}
				<input
					type="checkbox"
                    id={`bool-${this.state.id}`}
					name={this.state.name}
					value={this.state.value}
					eventname={this.state.eventname}
					defaultChecked={this.state.checked}
					onChange={this.toggleSwitch}
				/>
			</label>
		);
	}
}

export default BoolSwitch;
