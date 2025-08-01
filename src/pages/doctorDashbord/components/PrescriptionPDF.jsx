import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Helmet } from 'react-helmet'; // Using react-helmet for better async support
import PropTypes from 'prop-types';

// Register Arabic font (optional)
Font.register({
  family: 'Amiri',
  src: 'https://fonts.gstatic.com/s/amiri/v16/J7aRnpd8CGxBHpUrtLMA7w.ttf',
});

// Define styles for PDF
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

// Web preview styles
const webStyles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    direction: 'rtl',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  subheader: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  text: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  medItem: {
    marginBottom: '15px',
  },
};

const PrescriptionPDF = ({ patientName, date, medications, notes }) => {
  // Format date for SEO-friendly display
  const formattedDate = new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate dynamic SEO description
  const seoDescription = `روشتة طبية للمريض ${patientName} بتاريخ ${formattedDate}. تشمل الأدوية الموصوفة وملاحظات الطبيب.`;

  return (
    <>
      {/* SEO Metadata with Helmet */}
      <Helmet>
        <title>روشتة طبية - {patientName}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={`روشتة طبية, ${patientName}, أدوية, طبيب, ${formattedDate}`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`روشتة طبية - ${patientName}`} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`روشتة طبية - ${patientName}`} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      {/* Web Preview */}
      <div style={webStyles.container}>
        <h1 style={webStyles.header}>روشتة طبية</h1>
        <h2 style={webStyles.subheader}>اسم المريض: {patientName}</h2>
        <h2 style={webStyles.subheader}>التاريخ: {formattedDate}</h2>

        <h2 style={webStyles.subheader}>الأدوية الموصوفة:</h2>
        {medications.map((med, index) => (
          <div key={index} style={webStyles.medItem}>
            <p style={webStyles.text}>
              {index + 1}. {med.name}
            </p>
            <p style={webStyles.text}>الجرعة: {med.dosage}</p>
            <p style={webStyles.text}>المدة: {med.duration}</p>
          </div>
        ))}

        <h2 style={webStyles.subheader}>ملاحظات:</h2>
        <p style={webStyles.text}>{notes || 'لا توجد ملاحظات'}</p>
      </div>

      {/* PDF Document */}
      <Document>
        <Page style={styles.page}>
          <Text style={styles.header}>روشتة طبية</Text>
          <Text style={styles.subheader}>اسم المريض: {patientName}</Text>
          <Text style={styles.subheader}>التاريخ: {formattedDate}</Text>

          <Text style={styles.subheader}>الأدوية الموصوفة:</Text>
          {medications.map((med, index) => (
            <View key={index} style={styles.medItem}>
              <Text style={styles.text}>
                {index + 1}. {med.name}
              </Text>
              <Text style={styles.text}>الجرعة: {med.dosage}</Text>
              <Text style={styles.text}>المدة: {med.duration}</Text>
            </View>
          ))}

          <Text style={styles.subheader}>ملاحظات:</Text>
          <Text style={styles.text}>{notes || 'لا توجد ملاحظات'}</Text>
        </Page>
      </Document>
    </>
  );
};

// PropTypes for type checking
PrescriptionPDF.propTypes = {
  patientName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  medications: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      dosage: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
    })
  ).isRequired,
  notes: PropTypes.string,
};

export default PrescriptionPDF;
