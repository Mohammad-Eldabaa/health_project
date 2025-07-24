import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// تسجيل الخط العربي (اختياري)
Font.register({
    family: 'Amiri',
    src: 'https://fonts.gstatic.com/s/amiri/v16/J7aRnpd8CGxBHpUrtLMA7w.ttf',
});

// تعريف الأنماط
const styles = StyleSheet.create({
    page: {
        padding: 40,
        direction: 'rtl',
    },
    header: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'Amiri',
    },
    subheader: {
        fontSize: 14,
        marginBottom: 10,
        fontFamily: 'Amiri',
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
        fontFamily: 'Amiri',
    },
    medItem: {
        marginBottom: 15,
    },
});

const PrescriptionPDF = ({ patientName, date, medications, notes }) => (
    <Document>
        <Page style={styles.page}>
            <Text style={styles.header}>روشتة طبية</Text>
            <Text style={styles.subheader}>اسم المريض: {patientName}</Text>
            <Text style={styles.subheader}>التاريخ: {date}</Text>

            <Text style={styles.subheader}>الأدوية الموصوفة:</Text>
            {medications.map((med, index) => (
                <View key={index} style={styles.medItem}>
                    <Text style={styles.text}>{index + 1}. {med.name}</Text>
                    <Text style={styles.text}>الجرعة: {med.dosage}</Text>
                    <Text style={styles.text}>المدة: {med.duration}</Text>
                </View>
            ))}

            <Text style={styles.subheader}>ملاحظات:</Text>
            <Text style={styles.text}>{notes || 'لا توجد ملاحظات'}</Text>
        </Page>
    </Document>
);

export default PrescriptionPDF;