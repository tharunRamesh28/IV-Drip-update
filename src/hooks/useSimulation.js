import { useState, useEffect, useRef } from 'react';

const INITIAL = {
    iv_level_ml: 480,
    flow_rate_ml_min: 3.0,
    drops_per_min: 20,
    device_status: 'online',
    patient_name: 'Arun Kumar',
    patient_id: 'PAT-2024-0089',
    bed_number: '12',
    doctor_name: 'Dr. Rajesh Sharma',
    nurse_name: '',
    timestamp: Date.now(),
};

export function useSimulation(active) {
    const [data, setData] = useState({ ...INITIAL });
    const timerRef = useRef(null);

    useEffect(() => {
        if (!active) {
            clearInterval(timerRef.current);
            return;
        }

        // Reset on activate
        setData({ ...INITIAL });

        timerRef.current = setInterval(() => {
            setData(prev => {
                const newLevel = Math.max(prev.iv_level_ml - (0.5 + Math.random() * 0.3), 0);
                const flowRate = 3.0 + (Math.random() - 0.5) * 0.4;
                return {
                    ...prev,
                    iv_level_ml: Math.round(newLevel * 10) / 10,
                    flow_rate_ml_min: Math.round(flowRate * 10) / 10,
                    drops_per_min: Math.round(flowRate * 6.67),
                    device_status: 'online',
                    timestamp: Date.now(),
                };
            });
        }, 3000);

        return () => clearInterval(timerRef.current);
    }, [active]);

    return data;
}
