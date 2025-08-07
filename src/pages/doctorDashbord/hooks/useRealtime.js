// hooks/useRealtime.js
import { useEffect, useRef } from 'react';
import { setupRealtimePatients, removeRealtimeChannel } from '../../../lib/supabaseRealtime'

export const useRealtime = (callbacks = {}) => {
    const channelRef = useRef(null);
    const callbacksRef = useRef(callbacks);

    // تحديث المراجع عند تغيير الـ callbacks
    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);

    useEffect(() => {
        // إعداد الـ callbacks العامة للنافذة
        window.onPatientsUpdate = callbacksRef.current.onPatientsUpdate;
        window.onVisitsUpdate = callbacksRef.current.onVisitsUpdate;
        window.onPrescriptionsUpdate = callbacksRef.current.onPrescriptionsUpdate;
        window.onPrescriptionMedicationsUpdate = callbacksRef.current.onPrescriptionMedicationsUpdate;
        window.onTestRequestsUpdate = callbacksRef.current.onTestRequestsUpdate;

        // إعداد قناة الـ realtime
        channelRef.current = setupRealtimePatients();

        return () => {
            // تنظيف القناة عند إلغاء المكون
            if (channelRef.current) {
                removeRealtimeChannel(channelRef.current);
                channelRef.current = null;
            }

            // تنظيف الـ callbacks
            window.onPatientsUpdate = null;
            window.onVisitsUpdate = null;
            window.onPrescriptionsUpdate = null;
            window.onPrescriptionMedicationsUpdate = null;
            window.onTestRequestsUpdate = null;
        };
    }, []);

    return {
        channel: channelRef.current
    };
};