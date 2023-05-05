import React from 'react';
import {Dimensions, ImageBackground, ScrollView, StyleSheet, Text, View} from 'react-native';

const AboutScreen = () => {
  //   const logout = useCallback(() => {
  //     Auth.signOut();
  //   }, []);
  return (
    <ScrollView style={styles.scrollView}>
      <View>
        <View>
          <ImageBackground
            source={{uri: 'https://i.postimg.cc/QdkCDW7C/wallpaper1.jpg'}}
            style={{
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').height / 4,
            }}
            imageStyle={styles.imageStyle}>
            <View style={styles.DarkOverlay} />
            <View style={styles.searchContainer}>
              <Text style={styles.UserGreetings}>Hey, Welcome</Text>
              <Text style={styles.userText}>Go Near and Far</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.main}>
          <Text style={styles.title2}>For Tenants</Text>
          <View style={styles.mainContent}>
            <Text style={styles.title1}>How It Works?</Text>

            <Text style={styles.title3}>
              Start by searching the location you are interested in renting from. Apply filters like
              number of rooms, number of adults, or children to narrow your options.
            </Text>
            <Text style={styles.title3}>
              Browse through detailed descriptions of each home, including amenities available and
              call to rent once you have found your match.
            </Text>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title4}>Trust and Safety</Text>

            <Text style={styles.title3}>
              Trust and Safety is at the core of everything we do. We make sure that every home you
              see on the app looks exactly as it appears in person
            </Text>
            <Text style={styles.title3}>
              So you can be sure everything you see on the app is verified and appears exactly as it
              is portrayed.
            </Text>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title4}>Cancellation Options</Text>

            <Text style={styles.title3}>
              Flexibility is important to us. So we allow you to change your mind up until you move
              into any home.
            </Text>
            <Text style={styles.title3}>
              If you change your mind before moving into the house, we will charge you no fee for
              it.
            </Text>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title4}>Help and Support</Text>

            <Text style={styles.title3}>
              Whatever you choose, we are here to support you. We can also help arrange to move you
              into your new home
            </Text>
            <Text style={styles.title3}>
              We also help you after you move out to your new home in the event anything happens.
            </Text>
          </View>
        </View>

        <View style={styles.main}>
          <Text style={styles.title2}>For LandLords</Text>
          <View style={styles.mainContent}>
            <Text style={styles.title4}>How It Works?</Text>

            <Text style={styles.title3}>
              You can upload your home to the RentIt App. Open your home to thousands of tenants
              looking for a home to rent and earn money.
            </Text>
            <Text style={styles.title3}>
              Also, become a partner once you upload your home to the RentIt App for rent.
            </Text>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title4}>Trust and Safety</Text>

            <Text style={styles.title3}>
              You commit to uphold yourself to a higher standard of trust and integrity. People use
              RentIt because they trust everything they see.
            </Text>
            <Text style={styles.title3}>
              It is therefore important that every property you upload is entirely yours and is
              exactly as it appears.
            </Text>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title4}>Cancellation Options</Text>

            <Text style={styles.title3}>
              We allow our tenants a lot of flexibility in booking rooms to rent. Therefore, you
              commit to this flexibility once you upload your property to RentIt.
            </Text>
            <Text style={styles.title3}>
              You also commit to allow flexible move in dates for tenants once they rent your home.
            </Text>
          </View>

          <View style={styles.mainContent}>
            <Text style={styles.title4}>Help and Support</Text>

            <Text style={styles.title3}>
              We offer support and help to homeowners and landlords who upload their homes to RentIt
            </Text>
            <Text style={styles.title3}>
              Connect with other landlords and homeowners who have rent their homes through RentIt
              and make strong community connections.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  DarkOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height / 4,
    backgroundColor: '#000',
    opacity: 0.3,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  searchContainer: {
    paddingTop: 100,
    paddingLeft: 16,
  },
  UserGreetings: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  imageStyle: {
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  title1: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  title3: {
    fontSize: 16,
    padding: 10,
  },
  title4: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },
  main: {
    margin: 10,
    padding: 5,
  },
  mainContent: {
    margin: 20,
    padding: 5,
  },
});

export default AboutScreen;
