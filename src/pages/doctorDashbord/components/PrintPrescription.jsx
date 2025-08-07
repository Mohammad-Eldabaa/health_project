import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Tajawal',
    direction: 'rtl'
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 'bold',
    borderBottom: '2px solid #0891b2',
    paddingBottom: 10,
    color: '#155e75'
  },
  patientInfo: {
    marginBottom: 20,
    fontSize: 14,
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 15
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#155e75',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ecfeff',
    padding: 8,
    borderBottom: '1px solid #0891b2'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #e5e7eb'
  },
  col1: { width: '10%', textAlign: 'center' },
  col2: { width: '40%', textAlign: 'right' },
  col3: { width: '25%', textAlign: 'center' },
  col4: { width: '25%', textAlign: 'center' },
  notes: {
    backgroundColor: '#fefce8',
    border: '1px solid #fef08a',
    borderRadius: 4,
    padding: 12,
    marginTop: 15,
    fontSize: 14
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    textAlign: 'center',
    color: '#6b7280',
    borderTop: '1px dashed #d1d5db',
    paddingTop: 10
  }
});

const PrintPrescription = React.forwardRef(({
  patientName,
  today,
  notes,
  selectedMeds,
  doctorName = "د. أحمد محمد",
  doctorSpecialty = "أخصائي باطنة",
  clinicPhone = "0123456789"
}, ref) => {
  return (
    <Document ref={ref}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text>روشتة طبية</Text>
        </View>

        {/* Doctor Info */}
        <View style={styles.infoRow}>
          <Text>{doctorName}</Text>
          <Text>تخصص: {doctorSpecialty}</Text>
        </View>

        {/* Date */}
        <View style={{ ...styles.infoRow, marginBottom: 15 }}>
          <Text>التاريخ: {today}</Text>
        </View>

        {/* Patient Info */}
        <View style={styles.patientInfo}>
          <Text style={{ marginBottom: 5, fontWeight: 'bold' }}>بيانات المريض:</Text>
          <View style={styles.infoRow}>
            <Text>الاسم: {patientName || "غير محدد"}</Text>
          </View>
        </View>

        {/* Medications */}
        <Text style={styles.sectionTitle}>الأدوية الموصوفة</Text>
        <View>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>اسم الدواء</Text>
            <Text style={styles.col3}>الجرعة</Text>
            <Text style={styles.col4}>المدة</Text>
          </View>

          {Array.isArray(selectedMeds) && selectedMeds.length > 0 ? (
            selectedMeds.map((med, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.col1}>{index + 1}</Text>
                <Text style={styles.col2}>{med.name}</Text>
                <Text style={styles.col3}>{med.dosage}</Text>
                <Text style={styles.col4}>{med.duration}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.col1}>-</Text>
              <Text style={styles.col2}>لا توجد بيانات</Text>
              <Text style={styles.col3}>-</Text>
              <Text style={styles.col4}>-</Text>
            </View>
          )}

        </View>

        {/* Notes */}
        {notes && (
          <>
            <Text style={{ ...styles.sectionTitle, marginTop: 15 }}>تعليمات وإرشادات</Text>
            <View style={styles.notes}>
              <Text>{notes}</Text>
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>شكراً لثقتكم بنا - نتمنى لكم الشفاء العاجل</Text>
          <Text>للتواصل: {clinicPhone}</Text>
        </View>
      </Page>
    </Document>
  );
});

export default PrintPrescription;