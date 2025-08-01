import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { Document, Page, StyleSheet, Font } from '@react-pdf/renderer';

// Register Arabic font
Font.register({
  family: 'Tajawal',
  src: 'https://fonts.gstatic.com/s/tajawal/v9/Iurf6YBj_oCad4k1l_6gLrZjiY7_.ttf',
});

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Tajawal'
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: 10,
    color: '#1e3a8a'
  },
  clinicInfo: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 12,
    color: '#6b7280'
  },
  patientInfo: {
    marginBottom: 20,
    fontSize: 14
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1e40af',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5
  },
  medicationRow: {
    flexDirection: 'row',
    marginBottom: 8,
    fontSize: 12
  },
  medicationName: {
    width: '40%',
    fontWeight: 'bold'
  },
  medicationDetails: {
    width: '30%'
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    textAlign: 'center',
    color: '#6b7280'
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stamp: {
    border: '2px dashed #ef4444',
    padding: 10,
    fontSize: 10,
    color: '#ef4444'
  }
});

const PrintPrescription = React.forwardRef(({ patientName, today, notes, selectedMeds }, ref) => {
  return (
    <Document ref={ref}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.header}>روشتة طبية</Text>
          
          <Text style={styles.clinicInfo}>
            عيادة الدكتور/ أحمد محمد - تخصص باطنة
            {"\n"}
            تليفون: 0123456789 - العنوان: مدينة نصر، القاهرة
          </Text>
          
          <View  style={styles.patientInfo}>
            <Text>اسم المريض: {patientName}</Text>
            <Text>التاريخ: {today}</Text>
          </View>
          
          <Text style={styles.sectionTitle}>التشخيص:</Text>
          <Text style={{marginBottom: 15}}>{notes || 'لا توجد ملاحظات'}</Text>
          
          <Text style={styles.sectionTitle}>الأدوية الموصوفة:</Text>
          {selectedMeds.map((med, index) => (
            <View  key={index} style={styles.medicationRow}>
              <Text style={styles.medicationName}>{index + 1}. {med.name}</Text>
              <Text style={styles.medicationDetails}>الجرعة: {med.dosage}</Text>
              <Text style={styles.medicationDetails}>المدة: {med.duration}</Text>
            </View>
          ))}
          
          <View style={styles.signature}>
            <Text>توقيع الطبيب: ........................</Text>
            <Text style={styles.stamp}>ختم العيادة</Text>
          </View>
          
          <Text style={styles.footer}>
            شكراً لثقتكم بنا - يرجى الالتزام بالجرعات المحددة
            {"\n"}
            للاستفسار: 0123456789 - مواعيد العمل: من 9 صباحاً إلى 9 مساءاً
          </Text>
        </View>
      </Page>
    </Document>
  );
});

export default PrintPrescription;