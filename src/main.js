import React from 'react';
import ReactDom from 'react-dom';
import HeadFixTable from './components/HeadFixTable';
import {RACING_CARD_HEAD} from './utils/tableHead';
import body from './data';
import './style/init-style.scss';
import './style/main.sass';

function main() {
    ReactDom.render(
        <HeadFixTable
            head={RACING_CARD_HEAD}
            body={body}
            hasCheckBox={true}
        />,
        document.getElementById('app'));
}

main();