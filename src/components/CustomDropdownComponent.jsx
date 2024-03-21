import React, { useState } from 'react';
import { Modal, Portal, Text, Button, Provider, useTheme } from 'react-native-paper';
import PropTypes from "prop-types";

const DropdownComponent = ({
    control, // assuming you're using react-hook-form or similar for form control
    name, // the name for the control
    rules, // any rules for validation
    ...rest // rest of the props
}) => {
    const theme = useTheme();

    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    return (
        <Provider>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={modalStyle}>

                    <Text>Full time</Text>
                    <Text>Part time</Text>
                    <Text>Contract</Text>
                    <Text>Temporary</Text>
                    <Text>Volunteer</Text>
                    <Text>Apprenticeship</Text>
                </Modal>
            </Portal>
            <Button style={{ marginTop: 30 }} onPress={showModal} {...rest}>
                Choose Job Type
            </Button>
        </Provider>
    );
};

DropdownComponent.propTypes = {
    control: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    rules: PropTypes.object,
};

const modalStyle = { padding: 20, backgroundColor: 'white' };

export default DropdownComponent;
