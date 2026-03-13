import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

export function useFirebaseData(bedId = 'bed_01', enabled = true) {
    const [data, setData] = useState({
        iv_level_ml: 0,
        flow_rate_ml_min: 0,
        device_status: 'offline'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!enabled || !database) {
            setLoading(false);
            return;
        }

        // The user's hardware is writing to these specific paths
        const volumeRef = ref(database, "IV/volume");
        const flowRef = ref(database, "IV/flowrate");

        const unsubVolume = onValue(volumeRef, (snapshot) => {
            const val = snapshot.val();
            setData(prev => ({
                ...prev,
                iv_level_ml: val !== null ? Number(val) : 0,
                device_status: 'online'
            }));
            setLoading(false);
        }, (err) => {
            setError(err.message);
            setLoading(false);
        });

        const unsubFlow = onValue(flowRef, (snapshot) => {
            const val = snapshot.val();
            setData(prev => ({
                ...prev,
                flow_rate_ml_min: val !== null ? Number(val) : 0,
                device_status: 'online'
            }));
        });

        return () => {
            unsubVolume();
            unsubFlow();
        };
    }, [enabled]);

    return { data, error, loading };
}
