import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

export function useFirebaseData(bedId = 'bed_01', enabled = true) {
    const [data, setData] = useState({
        iv_level_ml: 0,
        flow_rate_ml_min: 0,
        device_status: 'offline',
        hardware_alert: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!enabled || !database) {
            setLoading(false);
            return;
        }

        // Listen to the entire IV node to capture all related parameters
        const ivRef = ref(database, "IV");

        const unsubIV = onValue(ivRef, (snapshot) => {
            const val = snapshot.val();
            
            if (val) {
                // Parse volume: prefer volume_ml, fallback to volume
                let volume = 0;
                if (val.volume_ml !== undefined && val.volume_ml !== null) {
                    volume = Number(val.volume_ml);
                } else if (val.volume !== undefined && val.volume !== null) {
                    volume = Number(val.volume);
                }

                // Parse flowrate: prefer flowrate_ml_min, fallback to flowrate
                let flowrate = 0;
                if (val.flowrate_ml_min !== undefined && val.flowrate_ml_min !== null) {
                    flowrate = Number(val.flowrate_ml_min);
                } else if (val.flowrate !== undefined && val.flowrate !== null) {
                    flowrate = Number(val.flowrate);
                }

                // Parse device status
                let status = 'offline';
                if (val.device_online === true || val.device_online === "true" || val.device_online === 1 || val.device_online === "1") {
                    status = 'online';
                }

                setData(prev => ({
                    ...prev,
                    iv_level_ml: volume,
                    flow_rate_ml_min: flowrate,
                    device_status: status,
                    hardware_alert: val.alert || ''
                }));
            } else {
                 // Null snapshot handling
                 setData(prev => ({
                    ...prev,
                    device_status: 'offline'
                }));
            }
            setLoading(false);

        }, (err) => {
            setError(err.message);
            setLoading(false);
        });

        return () => {
            unsubIV();
        };
    }, [enabled]);

    return { data, error, loading };
}
