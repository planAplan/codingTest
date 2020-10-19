import React from 'react';
import ReactDom from 'react-dom';
import HeadFixTable from './components/HeadFixTable';



function main() {
    ReactDom.render(<HeadFixTable />, document.getElementById('app'));
}


main();