import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import DashboardButton from 'components/common/DashboardButton';
import screen from 'store/wallet/screen';
import accountsModule from 'store/vault/accounts';
import Button from 'elements/Button';
import { Form, Row, styles as formStyles } from 'elements/Form/index';
import { Warning, WarningText, WarningHeader } from 'elements/Warning';

import FileDropField from './fileDropField';

class ImportJson extends React.Component {
    static propTypes = {
        importFile: PropTypes.func,
        showAccount: PropTypes.func,
        accounts: PropTypes.object,
        t: PropTypes.func,
        onDashboard: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            fileError: null,
            file: null,
        };
    }

    submitFile = () => {
        const { importFile, showAccount, accounts } = this.props;
        importFile(this.state.file).then((result) => {
            if (result.error) {
                this.setState({ fileError: result.error.toString() });
            } else {
                const account = accounts.find((a) => a.get('id') === result);
                if (account) {
                    showAccount(account);
                }
            }
        });
    }

    onFileChange = (file) => {
        this.setState({
            file,
        });
    }

    render() {
        const { t, onDashboard } = this.props;
        const { file, fileError } = this.state;

        return (
            <Form caption={ t('import.title') } backButton={ <DashboardButton onClick={ onDashboard }/> }>
                {fileError && (
                    <Row>
                        <div style={ formStyles.left }/>
                        <div style={ formStyles.right }>
                            <Warning fullWidth={ true }>
                                <WarningHeader>File error</WarningHeader>
                                <WarningText>{ fileError }</WarningText>
                            </Warning>
                        </div>
                    </Row>
                )}
                <Row>
                    <div style={ formStyles.left }/>
                    <div style={ formStyles.right }>
                        <FileDropField
                            name="wallet"
                            onChange={ this.onFileChange }
                        />
                    </div>
                </Row>

                {file && (
                    <Row>
                        <div style={ formStyles.left }/>
                        <div style={ formStyles.right }>
                            <Button primary onClick={ this.submitFile } label={ t('common:submit') }/>
                        </div>
                    </Row>)
                }
            </Form>
        );
    }
}

export default connect(
    (state, ownProps) => ({
        accounts: state.accounts.get('accounts', Immutable.List()),
    }),
    (dispatch, ownProps) => ({
        importFile: (file) => {
            return new Promise((resolve, reject) => {
                dispatch(accountsModule.actions.importWallet(file, '', ''))
                        .then((accountId) => resolve(accountId))
                        .catch((response) => resolve(response));
            });
        },
        showAccount: (account) => {
            dispatch(screen.actions.gotoScreen('account', account));
        },
        onDashboard: () => {
            dispatch(screen.actions.gotoScreen('home'));
        },
        cancel: () => {
            dispatch(screen.actions.gotoScreen('home'));
        },
    })
)(translate('accounts')(ImportJson));

