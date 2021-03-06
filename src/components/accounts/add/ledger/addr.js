import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import log from 'electron-log';
import { TableRowColumn, TableRow } from 'material-ui/Table';
import { tables } from 'lib/styles';
import AccountAddress from 'elements/AccountAddress';
import AccountBalance from '../../Balance';

const style = {
    used: {
        color: '#999',
    },
    usedIcon: {
        fontSize: '14px',
    },
};

const Render = ({ addr, alreadyAdded, ...otherProps }) => {
    let usedDisplay;
    if (alreadyAdded) {
        usedDisplay = <span style={style.used}>
            <FontIcon className="fa fa-check-square" style={style.usedIcon}/> Imported
        </span>;
    } else if (addr.get('txcount') > 0) {
        usedDisplay = <span style={style.used}>
            <FontIcon className="fa fa-check" style={style.usedIcon}/> Used
        </span>;
    } else {
        usedDisplay = <span style={style.used}>
            <FontIcon className="fa fa-square-o" style={style.usedIcon} /> New
        </span>;
    }

    const hasPath = addr.get('hdpath') !== null;
    const hasAddr = addr.get('address') !== null;

    return (
        <TableRow {...otherProps} selectable={hasPath && hasAddr && !alreadyAdded}>
            {otherProps.children[0] /* checkbox passed down from TableBody*/ }
            <TableRowColumn style={tables.shortStyle}>{addr.get('hdpath')}</TableRowColumn>
            <TableRowColumn style={tables.wideStyle}><AccountAddress id={addr.get('address')}/></TableRowColumn>
            <TableRowColumn style={tables.mediumStyle}>
                <AccountBalance
                    balance={addr.get('value')}
                    showFiat={true} withAvatar={false}
                />
            </TableRowColumn>
            <TableRowColumn style={tables.shortStyle}>
                {usedDisplay}
            </TableRowColumn>
        </TableRow>
    );
};

Render.propTypes = {
};

const Component = connect(
    (state, ownProps) => {
        const accounts = state.accounts.get('accounts');
        const addr = ownProps.addr;
        let alreadyAdded = false;
        try {
            const addrId = (addr.get('address') || '---R').toLowerCase();
            alreadyAdded = accounts.some((a) => a.get('id', '---L').toLowerCase() === addrId);
        } catch (e) {
            log.error(e);
        }
        return {
            alreadyAdded, addr,
        };
    },
    (dispatch, ownProps) => ({
        onAddSelected: () => {},
    })
)(Render);

export default Component;
