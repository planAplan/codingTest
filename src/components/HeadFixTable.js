import React, {Component} from 'react';
import {compareString} from '../utils/helper';
import './style/headFixTable.sass';

export default class HeadFixTable extends Component {
    state = {
        hidden: true,
        head: this.props.head,
        body: this.props.body,
        filterKey: this.props.head[0].key,
    };

    refresh = () => {
        this.setState({
            head: this.props.head,
            body: this.props.body
        });
    }
    getFixHead = () => {
        return this.state.head?.filter(h => h.fixed);
    }
    getFlexHead = () => {
        return this.state.head?.filter(h => !h.fixed);
    }
    renderFixHead = () => {
        let tempHead = this.getFixHead();
        if (this.props.hasCheckBox) {
            tempHead.unshift({
                key: 'checkBox',
                label: <input type="checkbox" onChange={this.HandleAllChecked}/>,
                fixed: true,
            })
        }
        return (
            tempHead?.map(item => {
                return (
                    <li key={item.key}>
                        <span className="icon"></span>
                        <span className={item.key === 'checkBox' ? 'checkBox_lead' : ''}>{item.label}</span>
                        <span className="operate"></span>
                    </li>
                );
            })
        );
    }
    renderFixBody = () => {
        let {body} = this.state;
        let fixHead = this.getFixHead()
        let realBody =  body?.map((b, i) => {
            let bodys = fixHead.map(h => {
                return (<li key={h.key} className={h.cls || ''}>{b[h.key]}</li>);
            })
            if (this.props.hasCheckBox) {
                bodys.unshift(<li className="checkbox" key={`checkbox-${i}`} data-index={i}><input onChange={(e) => {
                    this.handleCheckbox(e, b, i);
                }} type="checkbox"/></li>)
            }
            return (
                <ul>
                    {bodys}
                </ul>
            );
        })
        return realBody;
    }
    renderFlexHead = () => {
        let tempHead = this.getFlexHead();
        return tempHead?.map(item => {
            return (
                <li key={item.key}>
                    <span className="icon"></span>
                    <span>{item.label}</span>
                    <span className="operate"></span>
                </li>
            );
        })
    }
    renderFlexBody = () => {
        let {body} = this.state;
        let fixHead = this.getFlexHead()
        let realBody = body?.map(b => {
            return (
                <ul>
                    {
                        fixHead.map(h => {
                            return (<li key={h.key} className={h.cls || ''}>{b[h.key]}</li>);
                        })
                    }
                </ul>
            );
        })
        return realBody;
    }
    HandleAllChecked = (e) => {
        let checked = e?.target?.checked || false;
        let $allcheckbox = document.querySelectorAll(".checkbox>input");
        let check_set = new Set()
        Array.prototype.forEach.call($allcheckbox, (ele, i) => {
            ele.checked = checked;
            checked && check_set.add(i);
        })
        this.setState({
            checked: Array.from(check_set)
        });
    }
    handleCheckbox = (e, body, index) => {
        let checked = e.target?.checked || false;
        let checked_set = new Set(this.state.checked);
        if (checked) {
            checked_set.add(index);
        }
        this.setState({
            checked: Array.from(checked_set),
        })
    }
    handleHiddenChecked = () => {
        let {body, checked, hidden} = this.state;
        if (!checked?.length && hidden != false) return;
        let allItem = body.map((d,i) => i);
        let minus = allItem.filter(a => checked?.indexOf(a) == -1);
        let tempBody = [];
        minus.forEach(m => {
            tempBody.push(body[m]);
        })
        this.HandleAllChecked(false);
        let $checkbox = document.querySelectorAll(".checkBox_lead>input")[0];
        $checkbox.checked = false;
        this.setState({
            body: hidden ? tempBody : this.props.body,
            hidden: !hidden,
            checked: []
        })
    }
    handleSelect = (e) => {
        let v = e.target?.value ?? false;
        this.setState({
            filterKey: v
        })
    }
    createSelect = () => {
        let {head} = this.state;
        return (
            <label>
                <select onChange={this.handleSelect}>
                    {
                        head?.map(h => {return <option value={h.key}>{h.label}</option>})
                    }
                </select>
            </label>
        );
    }
    handleInputChange = (e) => {
        this.inputValue = e.target?.value || false;
        this.handleFilterClick();
    }
    handleFilterClick = () => {
        // let reg = new RegExp(`.*${this.inputValue}.*`, 'ig');
        // console.log(reg)
        if(!this.inputValue) {
            this.refresh()
            return;
        };
        let {body, filterKey} = this.props,
            result = [];
        body.forEach((b, i) => {
            let keys = Object.keys(b)
            for(let i = 0; i < keys.length; i++) {
                let k = keys[i];
                if (compareString(this.inputValue, b[k])) {
                    result.push(b);
                    continue;
                }
            }
        })
        if (result) {
            this.setState({
                body: result
            })
        } else {
            this.setState({
                body: [],
            })
        }
    }
    render () {
        let {hidden} = this.state;
        return (
            <div className="head-fix-table">
                <div className="tools">
                    <button onClick={this.handleHiddenChecked}>{hidden ? "Hidden" : "Show"}</button>
                    {this.createSelect()}
                    <label>
                        <button onClick={this.handleFilterClick}>filter</button>
                        <input type="text" onChange={this.handleInputChange}/>
                    </label>
                </div>
                <div className="fix">
                    <ul className="fix-head-wrap">
                        {this.renderFixHead()}
                    </ul>
                    <div className="fix-body-wrap">
                        {this.renderFixBody()}
                    </div>
                </div>
                <div className="flex-wrap">
                    <div className="flex">
                        <ul className="head-wrap">
                            {this.renderFlexHead()}
                        </ul>
                        <div className="body-wrap">
                            {this.renderFlexBody()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}