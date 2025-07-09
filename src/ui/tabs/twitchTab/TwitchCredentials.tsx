import {
    Border,
    Box,
    FormTextInput,
    SaveButton,
    Stack,
    useToast,
    ToastType,
} from '@greysole/spooder-component-library';
import React, { useEffect } from 'react';
import useTwitch from '../../../app/hooks/useTwitch';
import { FieldValues } from 'react-hook-form';

export default function TwitchCredentials() {
    const { getSaveTwitchConfig } = useTwitch();
    const { saveTwitchConfig, isLoading, isSuccess, error } = getSaveTwitchConfig();
    const { showToast } = useToast();

    useEffect(() => {
        const toastError = {
            message: 'An error occurred while saving Twitch configuration.',
            type: ToastType.ERROR,
            delay: 100
        };
        const toastSuccess = {
            message: 'Twitch configuration saved successfully!',
            type: ToastType.SUCCESS,
            delay: 100
        };
        if (isSuccess) {
            showToast({
                ...toastSuccess,
            });
        } else if (error) {
            showToast({
                ...toastError,
            });
        }
    }, [isSuccess, showToast]);

    const saveTwitchConfigHandler = (form: FieldValues) => {
        saveTwitchConfig(form);
    };

    return (
        <Border borderBottom>
            <Stack spacing='medium' padding='medium'>
                <FormTextInput label='Client ID' formKey='client-id' />
                <FormTextInput label='Client Secret' formKey='client-secret' />

                <Box>
                    <SaveButton saveFunction={saveTwitchConfigHandler} />
                </Box>
            </Stack>
        </Border>
    );
}
