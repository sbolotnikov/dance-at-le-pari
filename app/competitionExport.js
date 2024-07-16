import { View, Text, CheckBox, TouchableOpacity,Modal, TextInput, Image, Animated, Easing, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import Layout from '../components/layout';
import Btn from '../components/Btn';
import TextBox from '../components/TextBox';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import { useEffect, useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc'; 
import SelectDropdown from 'react-native-select-dropdown'; 
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 
import { LinearGradient } from 'expo-linear-gradient';
import { SelectList } from 'react-native-dropdown-select-list';
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider,} from 'reanimated-color-picker';
import useCompetition from '../hooks/useCompetition';  
  const pickImage = async (folder, name, width) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    const manipResult = await manipulateAsync(
      result.uri,
      [{ resize: { width: width } }],
      { format: 'jpeg' }
    );
    const storageRef = ref(storage, `${folder}/${(name)?name+uuidv4() + '.jpg':uuidv4() + '.jpg'}`);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', manipResult.uri, true);
      xhr.send(null);
    });
    const metadata = {
      contentType: 'image/jpeg',
    };
    const snapshot=await uploadBytes(storageRef, blob)
    return await getDownloadURL(snapshot.ref)
  };

  const deleteOldImage = async (folder,image) => {
    const cutPath =
    `https://firebasestorage.googleapis.com/v0/b/fads-loyalty-program.appspot.com/o/${folder}%2F`;
    let path1 = image.replaceAll(cutPath, '');
    image.length !== path1.length ? (path1 = path1.split('?')[0]) : (path1 = '');
    if (path1 !== '') {
      const desertRef = ref(storage, folder+'/' + path1);

      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          // File deleted successfully
          console.log('delete storage file');
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log(error.message);
        });
    }
  }

  const reverseColor = (str) =>{
    console.log(str)
    let n=parseInt(str.slice(1), 16);
    console.log(n)
    let retString="#"
    let rev = 0;
 
      // traversing bits of 'n' 
      // from the right
      while (n > 0) 
      {
          // bitwise left shift 
          // 'rev' by 1
          rev <<= 1;
 
          // if current bit is '1'
          if ((n & 1) == 1)
              rev ^= 1;
 
          // bitwise right shift 
          //'n' by 1
          n >>= 1;
      }
      return "#"+rev.toString(16)
  }
 
  const videoSearch =async  (link) =>{
    try {
     const data = await fetch( 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q='+link+'&key='+process.env.REACT_APP_FIREBASE_APIKEY ,
     {
       cache: 'no-cache',
       headers: {
         'Content-Type': 'application/json',
         'Content-Type': 'application/x-www-form-urlencoded',
       }
     })
     const res= await data.json()
     return res.items;
 }
 catch (error) {
     if (error) {
       return error
     }
   }
   } 
  
  const UrgentMessageComponent = (props) => {
    const [openList, setOpenList] = useState(false);
    const [urgentMessage, setUrgentMessage] = useState('');
    return (
      <View
        style={tw`h-11 w-[92%] rounded-full mt-5 bg-white justify-center items-start relative z-100`}
      >
        <TextInput
          style={tw`mt-0 h-11 pl-3 w-full rounded-full border-2 border-[#C9AB78]`}
          placeholder={'Enter urgent message'}
          secureTextEntry={false}
          value={urgentMessage}
          onChangeText={(text) => {
            setUrgentMessage(text);
            console.log(text)
            props.onChange(text);
          }}
        />
        <TouchableOpacity
          onPress={() => {
            setOpenList(!openList);
          }}
          style={tw`absolute top-4 right-3 z-10`}
        >
          <View // Special animatable View
            style={[
              tw.style(` `),
              {
                transform: [
                  {
                    rotate: openList ? '0deg' : '180deg',
                  },
                ],
              },
            ]}
          >
            <FontAwesome name="chevron-down" size={14} color={'#776548'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('add');
            props.onMessageArrayChange([...props.savedMessages, urgentMessage]);
          }}
          style={tw`absolute top-4 right-8 z-10 pr-3`}
        >
          <View 
          >
            <FontAwesome name="plus" size={14} color={'#776548'} />
          </View>
        </TouchableOpacity>
        {openList && (
          <View
            style={[
              tw`absolute top-full w-full  bg-white rounded-b-md `,
              { boxShadow: '0 30px 40px rgba(0,0,0,.1)' },
            ]}
          >
            {props.savedMessages.sort(function (a, b) {
                            return b == a ? 0 : b > a ? -1 : 1;
                          }).map((item, i) => (
              <View style={tw`w-full flex flex-row justify-between items-center`} key={i}>
                <TouchableOpacity
                  onPress={() => {
                    setUrgentMessage(item);
                    props.onChange(item);
                    setOpenList(!openList);
                  }}
                >
                  <Text style={tw`p-3`}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`p-3`}
                  onPress={() => {
                    console.log('delete');
                    props.onMessageArrayChange(props.savedMessages.filter(function (letter, index) {
      return index !== i;
  }));
                  }}>
                    <FontAwesome name="minus" size={14} color={'red'} />  
                  </TouchableOpacity>
              </View>
            ))}
            {/* list items */}
          </View>
        )}
      </View>
    );
  };
  
  const ChooseVideosModal = ({videosArray, vis, onReturn }) => {
      const handleSubmit = (e, submitten) => {
          e.preventDefault();
          if (submitten="Save"){
            onReturn(displayVideos)
          }else onReturn([]);
        };
        
        const [displayVideos, setDisplayVideos] = useState([]);
        const [videoLink, setVideoLink] = useState(''); 
        const [videoThumbNailLink, setVideoThumbNailLink] = useState(''); 
    const [videoLinkType, setVideoLinkType] = useState('Regular link');
    const [videoText, setVideoText] = useState('');
    
    useEffect(() => {
      (videosArray) ?setDisplayVideos(videosArray):setDisplayVideos([]);
      console.log('start ');
    }, [videosArray]); 
    return (
      <View style={tw` flex-1 justify-center items-center absolute top-0 left-0`}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={vis}
          onRequestClose={() => {}}
        >
          <View
            style={tw`flex-1 justify-center items-center w-full h-full bg-black/30`}
          >
            <View
              style={[
                tw` justify-center items-center bg-white w-[92%] h-[92%] max-w-[800px] rounded-md relative`,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 5,
                },
              ]}
            >
              <Text
                style={tw`px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center`}
              >
                Available videos
              </Text>
  
              <View
                style={tw`w-[97%] h-28 relative overflow-scroll border border-black p-1 rounded-md`}
              >
                <View
                  style={tw`absolute top-0 left-0  min-w-full h-full flex flex-wrap items-center justify-between`}
                >
                  {displayVideos &&
                    displayVideos.map((item, i) => (
                      <TouchableOpacity
                        key={'videocasting' + i}
                        style={tw`m-1 mr-4 flex flex-col items-start justify-around`}
                      >
                        <View style={tw`relative`}>
                          <View
                            style={tw` h-16 w-16 md:h-20 md:w-20 `}
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <Image
                              source={item.image}
                              style={tw`h-7 w-7 bg-gray-300 p-4 rounded-sm m-2`}
                            />
                          </View>
                          <View style={tw`absolute top-0 right-0`}>
                          <View style={tw`absolute top-0 right-0`} onClick={(e) => {  
                              console.log('Clicked');
                              let arr=displayVideos;
                              arr.splice(i, 1)
                               setDisplayVideos([...arr])
                              }}>
                              <Text>DeleteIcon</Text>                           
                          </View>
                          </View>
                          <Text style={tw`max-w-[100px] text-center`}>
                            {item.tag}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
              <View style={tw`flex-col justify-center items-center mb-2 w-full`}>
              <Image
                              source={{uri:videoThumbNailLink}}
                              resizeMethod={'scale'}
                              resizeMode={'center'}
                              style={tw`h-16 w-16 bg-gray-300 rounded-sm m-1`}
                            />
                            <View
                  style={tw`flex-row justify-center items-center mb-2 w-[50%]`}
                >
                <SelectList
                    
                    setSelected={(val) => {
                      setVideoLinkType(val);
                    }}
                    data={[ 'YouTube Link','Regular link']}
                    arrowicon={
                      <FontAwesome
                        name="chevron-down"
                        size={12}
                        color={'#776548'}
                      />
                    }
                    search={false}
                    boxStyles={{ width: 140,
                      height: 35,
                      backgroundColor: '#FFF',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#776548', }}
                  />
                  </View>
                <Text style={tw`font-semibold text-lg mt-1 text-[#344869]`}>
                  Enter your video link:
                </Text>
                
                <TextBox
                  placeholder="Enter link"
                  onChangeText={(text) => {
                    if (videoLinkType === 'YouTube Link') {
                      // add logic to handle GDrive link
                      setVideoLink(`https://www.youtube.com/embed/${text.split('https://youtu.be/')[1].split('?')[0]}?autoplay=1&loop=1&mute=1&playlist=${text.split('https://youtu.be/')[1].split('?')[0]}`); 
                      setVideoThumbNailLink(`http://img.youtube.com/vi/${text.split('https://youtu.be/')[1].split('?')[0]}/0.jpg`); 
                    } else {
                      setVideoLink(text)
                    } 
                    }}
                  secureTextEntry={false}
                  value={videoLink}
                />
                 <Text style={tw`font-semibold text-lg mt-1 text-[#344869]`}>
                  Enter your video thumbNail:
                </Text>
                
                <TextBox
                  placeholder="Enter link"
                  onChangeText={(text) => {
                     
                      setVideoThumbNailLink(text)
                  }}
                  secureTextEntry={false}
                  value={videoThumbNailLink}
                />
                <Text style={tw`font-semibold text-lg mt-1 text-[#344869]`}>
                  Choose text to video:
                </Text>
                <TextBox
                  placeholder="Enter text"
                  onChangeText={(text) => setVideoText(text)}
                  secureTextEntry={false}
                  value={videoText}
                />
                <Btn
                onClick={(e) =>{
                  let pic={tag:videoText,image:videoThumbNailLink, link:videoLink};
                  let arr=displayVideos;
                   arr.push(pic);
                  setDisplayVideos([...arr])
                }}
                title={'Add Video'}
                style={{ width: '90%', backgroundColor: '#3D1152' }}
              />
                </View>
              <Btn
                onClick={(e) => handleSubmit(e, 'Save')}
                title={'Save Changes'}
                style={{ width: '90%', backgroundColor: '#3D1152' }}
              />
              <Btn
                onClick={(e) => handleSubmit(e, 'Close')}
                title={'Close'}
                style={{ width: '90%', backgroundColor: '#344869' }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };
    
  function TextBox(props){
    return <View style={tw`h-11 w-[92%] rounded-full mt-5 bg-white justify-center items-start`}>
        <TextInput style={tw`mt-0 h-11 pl-3 w-full rounded-full border-2 border-[#C9AB78]`} {...props} />
    </View>
}

  const ChoosePicturesModal = ({displayPics,galleryType, vis, onReturn }) => {
    const handleSubmit = (e, submitten) => {
      e.preventDefault();
      if (submitten="Save"){
        onReturn(displayPictures)
      }else onReturn([]);
    };
    
    const [displayPictures, setDisplayPictures] = useState([]);
    const [pictureLink, setPictureLink] = useState('');
    const [pictureLinkType, setPictureLinkType] = useState('Regular link');
    const [pictureText, setPictureText] = useState('');
    
    useEffect(() => {
      (displayPics) ?setDisplayPictures(displayPics):setDisplayPictures([]);
      console.log('start ');
    }, [displayPics]);
    console.log(displayPictures);
    return (
      <View style={tw` flex-1 justify-center items-center absolute top-0 left-0`}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={vis}
          onRequestClose={() => {}}
        >
          <View
            style={tw`flex-1 justify-center items-center w-full h-full bg-black/30`}
          >
            <View
              style={[
                tw` justify-center items-center bg-white w-[92%] h-[92%] max-w-[800px] rounded-md relative`,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 5,
                },
              ]}
            >
              <Text
                style={tw`px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center`}
              >
                Available pictures
              </Text>
  
              <View
                style={tw`w-[97%] h-28 relative overflow-scroll border border-black p-1 rounded-md`}
              >
                <View
                  style={tw`absolute top-0 left-0  min-w-full h-full flex flex-wrap items-center justify-between`}
                >
                  {displayPictures &&
                    displayPictures.map((item, i) => (
                      <TouchableOpacity
                        key={'picturescasting' + i}
                        style={tw`m-1 mr-4 flex flex-col items-start justify-around`}
                      >
                        <View style={tw`relative`}>
                          <View
                            style={tw` h-16 w-16 md:h-20 md:w-20 `}
                            onClick={(e) => {
                              e.preventDefault();
                            }}
                          >
                            <Image
                              source={galleryType=="manual"?item.image:item}
                              style={tw`h-7 w-7 bg-gray-300 p-4 rounded-sm m-2`}
                            />
                          </View>
                          <View style={tw`absolute top-0 right-0`} onClick={(e) => {
                            e.preventDefault();
                            console.log('Clicked');
                            let arr=displayPictures;
                            arr.splice(i, 1)
                             setDisplayPictures([...arr])
                          }}>
                              <Text>DeleteIcon</Text>                           
                          </View>
                          {galleryType=="manual" &&<Text style={tw`max-w-[100px] text-center`}>
                            {item.tag}
                          </Text>}
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
              <View style={tw`flex-col justify-center items-center mb-2 w-full`}>
              <Image
                              source={{uri:pictureLink}}
                              resizeMethod={'scale'}
                              resizeMode={'center'}
                              style={tw`h-16 w-16 bg-gray-300 rounded-sm m-1`}
                            />
                            <View
                  style={tw`flex-row justify-center items-center mb-2 w-[50%]`}
                >
                <SelectList
                    
                    setSelected={(val) => {
                      setPictureLinkType(val);
                    }}
                    data={[ 'GDrive Link','Regular link']}
                    arrowicon={
                      <FontAwesome
                        name="chevron-down"
                        size={12}
                        color={'#776548'}
                      />
                    }
                    search={false}
                    boxStyles={{ width: 140,
                      height: 35,
                      backgroundColor: '#FFF',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#776548', }}
                  />
                  </View>
                <Text style={tw`font-semibold text-lg mt-1 text-[#344869]`}>
                  Enter your picture link:
                </Text>
                
                <TextBox
                  placeholder="Enter link"
                  onChangeText={(text) => {
                    if (pictureLinkType === 'GDrive Link') {
                      // add logic to handle GDrive link
                      setPictureLink(`https://drive.google.com/thumbnail?id=${text.split('/file/d/')[1].split('/')[0]}&sz=w1000`); 
                    } else {
                      setPictureLink(text)
                    } 
                    }}
                  secureTextEntry={false}
                  value={pictureLink}
                />
                {galleryType=="manual" &&<Text style={tw`font-semibold text-lg mt-1 text-[#344869]`}>
                  Choose text to picture:
                </Text>}
                {galleryType=="manual" &&<TextBox
                  placeholder="Enter text"
                  onChangeText={(text) => setPictureText(text)}
                  secureTextEntry={false}
                  value={pictureText}
                />}
                <Btn
                onClick={(e) =>{
                  let pic={tag:pictureText,image:pictureLink};
                  let arr=displayPictures;
                  (galleryType=="manual")?arr.push(pic):arr.push(pictureLink)
                  setDisplayPictures([...arr])
                }}
                title={'Add Picture'}
                style={{ width: '90%', backgroundColor: '#3D1152' }}
              />
                </View>
              <Btn
                onClick={(e) => handleSubmit(e, 'Save')}
                title={'Save Changes'}
                style={{ width: '90%', backgroundColor: '#3D1152' }}
              />
              <Btn
                onClick={(e) => handleSubmit(e, 'Close')}
                title={'Close'}
                style={{ width: '90%', backgroundColor: '#344869' }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  function Btn(props){
    return <TouchableOpacity style={{...tw`h-11 w-[92%] rounded-full mt-5 bg-[#3D1152] justify-center items-center`,...props.style}} onPress={props.onClick}>
        <Text style={tw`font-semibold text-xl text-white`}>{props.title}</Text>
    </TouchableOpacity>
}
  
  const ColorChoiceModal = (props) => {
    return (
      <View style={tw` flex-1 justify-center items-center absolute top-0 left-0`}>
        <Modal visible={props.vis} animationType="slide">
          <View
            style={tw`flex-1 justify-end items-center w-full h-full bg-black/30`}
          >
            <View
              style={[
                tw` justify-center items-center bg-white w-[92%] h-[62%] max-w-[800px] rounded-md relative`,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 5,
                },
              ]}
            >
              <ColorPicker
                style={{ width: '70%' }}
                value="red"
                onComplete={(ret)=>{props.onSelectColor(ret)}}
              >
                <Preview />
                <Panel1 />
                <HueSlider />
                <OpacitySlider />
                <Swatches />
              </ColorPicker>
              <Btn
                onClick={() => props.onClose(true)}
                title={'Close'}
                style={{ width: '90%', backgroundColor: '#3D1152' }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

   function CountBox({startValue, setWidth,onChange}){
    const [number, onChangeNumber] = useState(startValue);
    const changeNumber=(e,isAdd)=>{
        e.preventDefault();
        let increment=isAdd?1:-1;
        if((number==0)&&(!isAdd)) increment=0
        onChangeNumber(parseFloat(number)+increment)
        onChange(parseFloat(number)+increment)
    }
    return <View style={tw`flex-row justify-center items-center ml-2`}>
<TouchableOpacity style={tw`rounded-full bg-[#3D1152] mr-2`} onPress={(e)=>changeNumber(e,false)}>
    <Text style={tw` font-extrabold text-white text-xl px-3 mb-1`}>-</Text>
</TouchableOpacity>
        <TextInput style={tw` h-8 w-${setWidth} justify-center items-center`} onChangeText={onChangeNumber}
        value={number}/>
        <TouchableOpacity style={tw`rounded-full bg-[#3D1152] ml-2`} onPress={(e)=>changeNumber(e,true)}>
    <Text style={tw`font-extrabold text-white text-xl px-2 mb-1`}>+</Text>
</TouchableOpacity>
    </View>
} 
  
  const ManualImage = ({ seconds, image1, text1,compLogo,videoBG, titleBarHider }) => {
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeLogoAnim = useRef(new Animated.Value(0)).current;
    console.log(image1, text1);
    const sizeUp = fadeLogoAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0px', '1650px'],
    });
    const fadeOut = fadeLogoAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    const logo = require('../assets/risingStars.svg');
    const awardsPic = require('../assets/awards.png');
    let videoBGtrans =videoBG.split('&playlist')[0]+'&mute=1'+ '&playlist'+videoBG.split('&playlist')[1];	
    const winterPic = require('../assets/winterClass.svg');
    const [actPic, setActPic] = useState(winterPic);
    const [actText, setActText] = useState('Fred Astaire presents');
    const [activePic, setActivePic] = useState(0);
    const [size1, setSize] = useState(0);
    const [size2, setSize2] = useState(0);
    const dimensions={screen: Dimensions.get('window')}; 
    useEffect(() => {
      setActivePic(activePic + 1);
      Animated.timing(fadeLogoAnim, {
        duration: parseInt((seconds * 1000 * 2) / 8),
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: false,
      }).start(() => {
        fadeLogoAnim.setValue(0);
      });
      Animated.timing(fadeAnim, {
        duration: parseInt((seconds * 1000) / 8),
        toValue: 0,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        setActPic(image1);
        setActText(text1);
        Animated.timing(fadeAnim, {
          duration: parseInt((seconds * 1000) / 8),
          toValue: 1,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }).start();
      });
    }, [image1]);
    useEffect(() => {
      setSize(
        dimensions.screen.width > 1000
          ? 15 : 25
      );
      setSize2(
          dimensions.screen.width > 1000
          ? 28
          : dimensions.screen.width > 500
          ? 24
          : 24
        );
  
    }, [dimensions.screen.width]);
    return (
      <SafeAreaView
        style={tw`w-full h-full flex justify-start items-center z-0`}
      >
      <iframe width={dimensions.screen.width} 
                      height={dimensions.screen.height} allow="autoplay;fullscreen;" frameBorder="0" loop
                    allowFullScreen="" src={videoBGtrans }>
                    </iframe>
        <Animated.View // Special animatable View   
          style={[
            tw.style(`absolute inset-0 m-auto w-full h-full `),
            { opacity: fadeAnim }, // Bind opacity to animated value
          ]}
        >
        
          {image1 && (
            <ImageBackground
              source={actPic}
              resizeMethod={'scale'}
              resizeMode={'center'}
              style={[tw`h-full w-auto my-auto z-10`, {boxShadow: '0 30px 40px rgba(0,0,0,.1)'}]}
            > 
            </ImageBackground>
          )} 
          {text1 && !titleBarHider && (
            <View
              style={[
                tw`bg-purple-400 absolute left-0 right-0 top-0 h-[${size1}%]  flex justify-${size2==24?'start':"center"} items-center`,
                { opacity: 0.7 },
              ]}
            >
              <Image
                source={{uri:compLogo}}
                style={tw` absolute top-2 left-${size2==24?2:22} w-${size2} h-${size2} mt-${size2==24?8:1} `}
              />
              <Text
                style={[
                  tw` font-bold text-white opacity-100 text-6xl text-center `,
                  {
                    textShadow: '5px 5px #C9AB78',
                    fontFamily: 'DancingScript',
                    zIndex: 100,
                  },
                ]}
              >
                {actText}
              </Text>
            
            </View>
          )}
        </Animated.View>
        <View // Special animatable View
          style={[
            tw.style(
              `absolute inset-0 m-auto w-full h-full flex justify-center items-center `
            ),
            // Bind opacity to animated value
          ]}
        >
          <Animated.View
            style={{ opacity: fadeOut, height: sizeUp, width: sizeUp }}
          >
            <Image source={compLogo} style={[tw`h-full w-full`]} />
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  };

  const AutoImages = ({ picsArray, seconds, image1, text1,compLogo,videoBG, titleBarHider }) => {
    const [activePic, setActivePic] = useState(0);
    let timerIntervalID;
    const nextActive = (num) => {
      timerIntervalID = window.setTimeout(function () {
        window.clearTimeout(timerIntervalID);
        console.log('interval cleared in nextActive');
        let localPic = num;
        if (localPic < picsArray.length - 1) localPic++;
        else localPic = 0;
        setActivePic(localPic);
        nextActive(localPic);
      }, seconds * 1000);
    };
  
    useEffect(() => {
      // clearTimeout(timerInterval);
      let id = window.setTimeout(function() {}, 0);
      while (id--) {
          window.clearTimeout(id); // will do nothing if no timeout with id is present
      }
      console.log('interval cleared in useEffect');
      setActivePic(0);
      nextActive(0);
    }, []);
    return (
        <ManualImage image1={picsArray[activePic]} seconds={seconds}  text1={ text1} compLogo={compLogo} videoBG={videoBG} titleBarHider={titleBarHider}/>
  
    );
  };
  
  const VideoPlayingComponent = ({ seconds, videoUri, text1, titleBarHider }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeTextAnim = useRef(new Animated.Value(0)).current;
   
    useEffect(() => {
      fadeTextAnim.setValue(0);
      fadeAnim.setValue(0);
      Animated.timing(fadeTextAnim, {
        duration: parseInt((seconds * 1000) ),
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: false,
      }).start(() => {
          Animated.timing(fadeAnim, {
              duration: parseInt(seconds * 1000),
              toValue: 1,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }).start();
      });
     
    }, [videoUri]);
   
    return (
      <SafeAreaView
        style={tw`w-full h-full flex justify-start items-center relative`}
      >
        <center>
          <iframe
            width={dimensions.screen.width}
            height={dimensions.screen.height}
            allow="autoplay;fullscreen;"
            frameBorder="0"
            loop
            allowFullScreen=""
            src={videoUri}
          ></iframe>
        </center>
        <Animated.View // Special animatable View
          style={[
            tw.style(
              `absolute inset-0  w-full h-full flex justify-center items-center`
            ),
            {fontSize: fadeTextAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0px', '100px'],
                  })},
              { opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }) }, 
          ]}
        >
          {text1 && !titleBarHider && (
            <Text
              style={[
                tw` font-bold text-white p-3 rounded text-center `,
                {
                  textShadow: '5px 5px #C9AB78',
                  zIndex: 100,
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  fontSize:'inherit'  
                },
              ]}
            >
              {text1}
            </Text>
          )}
        </Animated.View>
      </SafeAreaView>
    );
  }; 

  const ShowPlayingModal = ({
    videoUri,
    videoBG,
    button1,
    compName,
    heatNum,
    mode,
    fontSize,
    seconds,
    manualPicture,
    displayedPicturesAuto,
    vis,
    compLogo,
    message,
    titleBarHider,
    showUrgentMessage,
    textColor,
    onReturn,
    heatText,
  }) => {
    const handleSubmit = (e, submitten) => {
      e.preventDefault();
      onReturn(submitten);
    };
   
    const logo = require('../assets/VERTICAL-FADS-whtgold.png');
    const [timeNow, setTimeNow] = useState(''); 
    const dimensions={screen: Dimensions.get('window')};
    const fadeAnim = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      if (showUrgentMessage === true){
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        duration: parseInt((1000) ),
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: false,
      }).start(() => {
          Animated.timing(fadeAnim, {
              duration: parseInt(1000),
              toValue: 0,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }).start(
              () => {
                Animated.timing(fadeAnim, {
                  duration: parseInt((1000) ),
                  easing: Easing.out(Easing.ease),
                  toValue: 1,
                  useNativeDriver: false,
                }).start(() => {
                  Animated.timing(fadeAnim, {
                      duration: parseInt(1000),
                      toValue: 0,
                      easing: Easing.inOut(Easing.ease),
                      useNativeDriver: false,
                    }).start(
                      () => {
                        Animated.timing(fadeAnim, {
                          duration: parseInt((1000) ),
                          easing: Easing.out(Easing.ease),
                          toValue: 1,
                          useNativeDriver: false,
                        }).start();
                      }
                    );
              });
              }
            );
      });
    }
  }, [showUrgentMessage, message]);
    useEffect(() => {
      let timerInterval = setInterval(function () {
        // create a new `Date` object
        const now = new Date();
        // get the current date and time as a string
        const currentDateTime = now.toLocaleString();
        // update the `textContent` property of the `span` element with the `id` of `datetime`
        setTimeNow(currentDateTime.split(',')[1]);
        clearInterval(timerInterval);
      }, 1000);
    }, [vis, timeNow]);
    return (
      <View
        style={tw` flex-1 justify-center items-center w-[100%] h-[100%] absolute top-0 left-0`}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={vis}
          onRequestClose={() => {}}
        >
          <View
            style={tw`relative  w-[${dimensions.screen.width}px] h-[${dimensions.screen.height}px]`}
          >
            <LinearGradient
              colors={['yellow', 'red', 'brown', 'red', 'yellow']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={tw`w-full h-full flex justify-start items-center`}
            >
              {mode == 'Video' ? (
                <VideoPlayingComponent
                  videoUri={videoUri.link}
                  text1={videoUri.name}
                  titleBarHider={titleBarHider}
                  seconds={seconds}
                />
              ) : mode == 'Auto' ? (
                <AutoImages
                  picsArray={displayedPicturesAuto}
                  seconds={seconds}
                  videoBG={videoUri.link}
                  text1={manualPicture.name}
                  compLogo={compLogo}
                  titleBarHider={titleBarHider}
                />
              ) : mode == 'Manual' ? (
                <ManualImage
                  image1={manualPicture.link}
                  text1={manualPicture.name}
                  compLogo={compLogo}
                  titleBarHider={titleBarHider}
                  videoBG={videoUri.link}
                  seconds={seconds}
                />
              ) : mode == 'Default' ? (
                <SafeAreaView
                  style={tw`w-full h-full flex justify-center items-center`}
                >
                  <Image
                    source={compLogo}
                    resizeMethod={'resize'}
                    resizeMode={'center'}
                    style={[tw`h-[750px] w-[760px]`]}
                  />
                </SafeAreaView>
              ) : mode == 'Heats' ? (
                <View style={tw`w-full h-full flex justify-center items-center`}>
                  <Text
                    style={[
                      tw`text-white  text-[${fontSize}px]`,
                      { textAlign: 'center' },
                    ]}
                  >
                    {heatText}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text>Underfined</Text>
                </View>
              )}
              {showUrgentMessage &&<Animated.View
                onClick={(e) => handleSubmit(e, button1)}
                style={[tw`absolute inset-0 flex justify-center items-center`, { cursor: 'pointer', opacity: fadeAnim }]}
              >
                <Text
                  style={[
                    tw`text-[${textColor}] font-bold  m-0`,
                    {
                      textShadow: '5px 5px #C9AB78',
                      fontSize: fontSize+'px',
                    },
                  ]}
                >
                  {message}
                </Text>
              </Animated.View>}
              <View
                onClick={(e) => handleSubmit(e, button1)}
                style={[tw`absolute top-0 left-1`, { cursor: 'pointer' }]}
              >
                <Text
                  style={[
                    tw`text-[${textColor}] font-bold text-3xl m-0`,
                    {
                      textShadow: '5px 5px #C9AB78',
                      
                    },
                  ]}
                >
                  {heatNum}
                </Text>
              </View>
              
              <View
                onClick={(e) => handleSubmit(e, button1)}
                style={[tw`absolute top-0 right-1`, { cursor: 'pointer' }]}
              >
                <Text
                  id="datetime"
                  style={[
                    tw`text-[${textColor}] font-bold text-3xl m-0`,
                    {
                      // textShadow: '5px 5px #C9AB78',
                    },
                  ]}
                >
                  {timeNow}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      </View>
    );
  };
 
const CompetitionScreen = () => {  
  const [modalVisible, setModalVisible] = useState(false);
  const [modal1Visible, setModal1Visible] = useState(false); 
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modal4Visible, setModal4Visible] = useState(false);
  const [modal5Visible, setModal5Visible] = useState(false);
  const [galleryType, setGalleryType] = useState(null);
  const [galleryArr, setGalleryArr] = useState(null);
  const [videoSearchText, setVideoSearchText] = useState('');
  useEffect(() => {
    setModal1Visible(true);
  }, []);

  const {
    image,
    dates,
    currentHeat,
    name,
    message,
    id, 
    items,
    mode,
    fontSize,
    displayedPictures,
    displayedPicturesAuto,
    seconds,
    manualPicture,
    displayedVideos,
    videoChoice,
    videoBGChoice,
    compLogo,
    titleBarHider,
    showUrgentMessage,
    savedMessages,
    textColor,
    setCompID,
  } = useCompetition();

  function handleChange(text, eventName) {
    updateDoc(doc(db, 'competitions', id), {
      [eventName]: text,
    });
 
  }
  function convertToPlain(rtf) {
    rtf = rtf.replace(/\\par[d]?/g, '');
    return rtf
      .replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, '')
      .trim();
  }
  //Function to check if it is single dance or Combination

  const nameOfDance = (str) => {
    let danceSet = [
      'Cha Cha',
      'Samba',
      'Rumba',
      'Paso Doble',
      'Jive',
      'Waltz',
      'Tango',
      'Viennese Waltz',
      'Foxtrot',
      'Quickstep',
      'Swing',
      'Bolero',
      'Mambo',
      'Argentine Tango',
      'Merengue',
      'West Coast Swing',
      'Salsa',
      'Hustle',
      'Bachata',
    ];
    for (let i = 0; i < danceSet.length; i++) {
      if (str.toLowerCase().includes(danceSet[i].toLowerCase()))
        return danceSet[i];
    }
    return '';
  };
  const onPressPicture = async (e) => {
    e.preventDefault();
    let picURL = await pickImage('competitions', '', 300);
    deleteOldImage('competitions', image);
    handleChange(picURL, 'image');
  };

  return  
    <View
      style={[
        tw` flex-1 justify-center items-center w-[100%] h-[100%] absolute top-0 left-0`,
        { overflow: 'hidden' },
      ]}
    >
 
      <ColorChoiceModal
        onSelectColor={(ret) => {
          console.log(ret.hex);
          handleChange(ret.hex, 'textColor');
          setModal5Visible(false);
        }}
        onClose={(ret) => setModal5Visible(false)}
        vis={modal5Visible}
      />
      <ChooseVideosModal
        videosArray={displayedVideos}
        vis={modal4Visible}
        onReturn={(ret) => {
          if (ret && ret.length > 0) {
            console.log(ret);
            handleChange(ret, 'displayedVideos');
          }
          setModal4Visible(false);
        }}
        
      />
      <ShowPlayingModal
        videoUri={videoChoice}
        videoBG={videoBGChoice}
        heatText={""}
        manualPicture={manualPicture}
        displayedPicturesAuto={displayedPicturesAuto}
        button1={'Ok'}
        compName={name}
        heatNum={currentHeat}
        vis={modalVisible}
        mode={mode}
        fontSize={fontSize}
        seconds={seconds}
        message={message}
        compLogo={compLogo.link}
        titleBarHider={titleBarHider}
        showUrgentMessage={showUrgentMessage}
        textColor={textColor}
        onReturn={(ret) => setModalVisible(false)}
      />
      {galleryType && (
        <ChoosePicturesModal
          displayPics={galleryArr}
          galleryType={galleryType}
          vis={modal3Visible}
          onReturn={(ret) => {
            if (ret && ret.length > 0) {
              galleryType == 'auto'
                ? handleChange(ret, 'displayedPicturesAuto')
                : handleChange(ret, 'displayedPictures');
            }
            setModal3Visible(false);
          }}
        />
      )}
      <Layout>
        <View
          style={{
            width: '100%',
            height: '85vh',
            position: 'relative',
            overflowY: 'scroll',
          }}
        >
          <View
            style={tw`w-full absolute top-0 left-0 flex flex-col justify-start items-center mt-14`}
          >
              <View>
                <TouchableOpacity
                  style={tw`w-[92%] h-48 m-1 `}
                  onPress={(e) => onPressPicture(e)}
                >
                  {image > '' ? (
                    <View
                      style={[
                        tw` h-full w-full rounded-md`,
                        {
                          objectFit: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundImage: `url(${image})`,
                        },
                      ]}
                    />
                  ) : (
                    <View
                      style={tw` h-full w-full justify-center items-center`}
                    >
                      <Text>Please click to choose image</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <View style={tw` w-full flex-row justify-center items-start`}>
                  <View style={tw` flex-col justify-center items-center`}>
                    <SelectDropdown
                      dropdownBackgroundColor={'white'}
                      data={['Auto', 'Video', 'Heats', 'Manual', 'Default']}
                      defaultValue={mode}
                      onSelect={(selectedItem, index) => {
                        handleChange(selectedItem, 'mode');
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        //   console.log(selectedItem, index);
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item;
                      }}
                      buttonStyle={{
                        width: 140,
                        height: 35,
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#776548',
                      }}
                      buttonTextStyle={{ color: '#444', textAlign: 'left' }}
                      renderDropdownIcon={(isOpened) => {
                        return (
                          <FontAwesome
                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                            color={'#776548'}
                            size={14}
                          />
                        );
                      }}
                      dropdownStyle={{
                        backgroundColor: '#EFEFEF',
                        borderRadius: 8,
                        borderWidth: 1,
                        width: 140,
                        borderColor: '#776548',
                      }}
                      rowStyle={{
                        backgroundColor: '#EFEFEF',
                        height: 45,
                        borderBottomColor: '#C5C5C5',
                      }}
                      rowTextStyle={{
                        color: '#444',
                        textAlign: 'center',
                        margin: 'auto',
                        textSize: 18,
                      }}
                    />
                    <Text style={{ textAlign: 'center', width: 130 }}>
                      Choose casting mode
                    </Text>
                  </View>
                  <View>
                    <CountBox
                      startValue={
                        parseInt(fontSize) > 0 ? parseInt(fontSize) : 34
                      }
                      setWidth={4}
                      onChange={(num) => {
                        console.log(num);
                        handleChange(num, 'fontSize');
                      }}
                    />
                    <Text style={{ textAlign: 'center', width: 90 }}>
                      Choose font size
                    </Text>
                  </View>
                  <View style={tw`flex flex-col justify-center items-center h-[4rem]`}>
                    <TouchableOpacity
                      onPress={(e) =>{ setModal5Visible(true)}}
                      style={{ width: '4.25rem', backgroundColor: reverseColor(textColor), textAlign: 'center', marginTop: 0, marginLeft: '0.25rem', borderRadius: '0.4rem' }}
                    >
                    <Text style={[tw`text-xl font-semibold`,{ textAlign: 'center', color:textColor, }]}>{'Text Color'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <CountBox
                      startValue={
                        parseInt(seconds) > 0 ? parseInt(seconds) : 10
                      }
                      setWidth={4}
                      onChange={(num) => {
                        console.log(num);
                        handleChange(num, 'seconds');
                      }}
                    />
                    <Text style={{ textAlign: 'center', width: 95 }}>
                      Choose seconds/frame
                    </Text>
                  </View>
                </View>
                {displayedPictures && (
                  <View
                    style={tw` w-full flex-col justify-center items-center`}
                  >
                    <SelectDropdown
                      dropdownBackgroundColor={'white'}
                      data={displayedPictures
                        .sort(function (a, b) {
                          return b.tag == a.tag ? 0 : b.tag > a.tag ? -1 : 1;
                        })
                        .map((item) => item.tag)}
                      defaultValue={manualPicture ? manualPicture.name : ''}
                      onSelect={(selectedItem, index) => {
                        handleChange(
                          {
                            name: selectedItem,
                            link: displayedPictures.sort(function (a, b) {
                              return b.tag == a.tag
                                ? 0
                                : b.tag > a.tag
                                ? -1
                                : 1;
                            })[index].image,
                          },
                          'manualPicture'
                        );
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        //   console.log(selectedItem, index);
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item;
                      }}
                      buttonStyle={{
                        width: 240,
                        height: 35,
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#776548',
                      }}
                      buttonTextStyle={{ color: '#444', textAlign: 'left' }}
                      renderDropdownIcon={(isOpened) => {
                        return (
                          <FontAwesome
                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                            color={'#776548'}
                            size={14}
                          />
                        );
                      }}
                      dropdownStyle={{
                        backgroundColor: '#EFEFEF',
                        borderRadius: 8,
                        borderWidth: 1,
                        width: 240,
                        borderColor: '#776548',
                      }}
                      rowStyle={{
                        backgroundColor: '#EFEFEF',
                        height: 45,
                        borderBottomColor: '#C5C5C5',
                      }}
                      rowTextStyle={{
                        color: '#444',
                        textAlign: 'center',
                        margin: 'auto',
                        textSize: 18,
                      }}
                    />
                    <Text style={{ textAlign: 'center', width: 195 }}>
                      Choose Picture for manual
                    </Text>
                  </View>
                )}
                <View style={tw` w-full flex-col justify-center items-center`}>
                  <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    <CheckBox
                      value={titleBarHider}
                      onValueChange={(value) => {
                        handleChange(value, 'titleBarHider');
                        console.log(value);
                      }}
                      style={{ alignSelf: 'center' }}
                    />
                    <Text style={tw`ml-2`}>Hide Title Bar</Text>
                  </View>
                </View>
                {displayedPictures && (
                  <View
                    style={tw` w-full flex-col justify-center items-center`}
                  >
                    <SelectDropdown
                      dropdownBackgroundColor={'white'}
                      data={displayedPictures
                        .sort(function (a, b) {
                          return b.tag == a.tag ? 0 : b.tag > a.tag ? -1 : 1;
                        })
                        .map((item) => item.tag)}
                      defaultValue={compLogo ? compLogo.name : ''}
                      onSelect={(selectedItem, index) => {
                        handleChange(
                          {
                            name: selectedItem,
                            link: displayedPictures.sort(function (a, b) {
                              return b.tag == a.tag
                                ? 0
                                : b.tag > a.tag
                                ? -1
                                : 1;
                            })[index].image,
                          },
                          'compLogo'
                        );
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => { 
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item;
                      }}
                      buttonStyle={{
                        width: 240,
                        height: 35,
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#776548',
                      }}
                      buttonTextStyle={{ color: '#444', textAlign: 'left' }}
                      renderDropdownIcon={(isOpened) => {
                        return (
                          <FontAwesome
                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                            color={'#776548'}
                            size={14}
                          />
                        );
                      }}
                      dropdownStyle={{
                        backgroundColor: '#EFEFEF',
                        borderRadius: 8,
                        borderWidth: 1,
                        width: 240,
                        borderColor: '#776548',
                      }}
                      rowStyle={{
                        backgroundColor: '#EFEFEF',
                        height: 45,
                        borderBottomColor: '#C5C5C5',
                      }}
                      rowTextStyle={{
                        color: '#444',
                        textAlign: 'center',
                        margin: 'auto',
                        textSize: 18,
                      }}
                    />
                    <Text style={{ textAlign: 'center', width: 195 }}>
                      Choose Picture for Logo
                    </Text>
                  </View>
                )}

                {displayedVideos && (
                  <View
                    style={tw` w-full flex-col justify-center items-center`}
                  >
                    <SelectDropdown
                      dropdownBackgroundColor={'white'}
                      data={displayedVideos
                        .sort(function (a, b) {
                          return b.tag == a.tag ? 0 : b.tag > a.tag ? -1 : 1;
                        })
                        .map((item) => item.tag)}
                      defaultValue={videoChoice ? videoChoice.name : ''}
                      onSelect={(selectedItem, index) => {
                        handleChange(
                          {
                            name: selectedItem,
                            link: displayedVideos.sort(function (a, b) {
                              return b.tag == a.tag
                                ? 0
                                : b.tag > a.tag
                                ? -1
                                : 1;
                            })[index].link,
                          },
                          'videoChoice'
                        );
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        //   console.log(selectedItem, index);
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item;
                      }}
                      buttonStyle={{
                        width: 240,
                        height: 35,
                        backgroundColor: '#FFF',
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#776548',
                      }}
                      buttonTextStyle={{ color: '#444', textAlign: 'left' }}
                      renderDropdownIcon={(isOpened) => {
                        return (
                          <FontAwesome
                            name={isOpened ? 'chevron-up' : 'chevron-down'}
                            color={'#776548'}
                            size={14}
                          />
                        );
                      }}
                      dropdownStyle={{
                        backgroundColor: '#EFEFEF',
                        borderRadius: 8,
                        borderWidth: 1,
                        width: 240,
                        borderColor: '#776548',
                      }}
                      rowStyle={{
                        backgroundColor: '#EFEFEF',
                        height: 45,
                        borderBottomColor: '#C5C5C5',
                      }}
                      rowTextStyle={{
                        color: '#444',
                        textAlign: 'center',
                        margin: 'auto',
                        textSize: 18,
                      }}
                    />
                    <Text style={{ textAlign: 'center', width: 195 }}>
                      Choose Video
                    </Text>

                    {/* set video seach here */}
                    <TextBox
                      placeholder="Video search tool"
                      onChangeText={(text) => setVideoSearchText(text)}
                      secureTextEntry={false}
                      value={videoSearchText}
                    />
                    <Btn
                      onClick={async (e) => {
                        e.preventDefault();
                        const data1 = await videoSearch(videoSearchText);

                        console.log(data1);

                        handleChange(
                          { 
                            name: videoSearchText,
                            link: `https://www.youtube.com/embed/${data1[0].id.videoId}?autoplay=1&mute=1&loop=1&playlist=${data1[0].id.videoId}`,
                          },
                          'videoChoice'
                        );
                        
                      }}
                      title="Search"
                      style={{
                        width: '48%',
                        backgroundColor: '#3D1152',
                        marginTop: '5px',
                        marginBottom: '5px',
                      }}
                    />
                  </View>
                )}
                <View style={tw` w-full flex-row justify-center items-start`}>
                  <View style={tw` flex-col justify-center items-center`} onClick={(e)=>{
                    e.preventDefault();
                    setGalleryType('manual');
                    if (displayedPictures)
                      setGalleryArr([...displayedPictures]);
                    setModal3Visible(true); 
                  }}>
                    <Text style={{ textAlign: 'center', width: 85 }}>
                      Choose pictures for manual
                    </Text>
                  </View>
                  <View style={tw` flex-col justify-center items-center`} onClick={(e)=>{
                    e.preventDefault();
                    setGalleryType('auto');
                    if (displayedPicturesAuto)
                      setGalleryArr([...displayedPicturesAuto]);
                    setModal3Visible(true);
                  }}>
                    <Text style={{ textAlign: 'center', width: 85 }}>
                      Choose pictures for auto
                    </Text>
                  </View>
                  <View OnClick={(e)=>{
                     e.preventDefault();
                     setModal4Visible(true);
                  }}>
                    <Text style={{ textAlign: 'center', fontStyle: 'oblique' }}>
                      Choose videos
                    </Text>
                  </View>
                  <View onClick={(e)=>{
                    e.preventDefault();
                    setModalVisible(true);
                  }}> 
                    <Text style={{ textAlign: 'center', width: 45 }}>
                      Start Show
                    </Text>
                  </View>
 
                </View>
              </View>
             

            <UrgentMessageComponent
              savedMessages={savedMessages}
              onChange={(text) => {
                console.log(text);
                handleChange(text, 'message');
              }}
              onMessageArrayChange={(array) => {
                console.log(array);
                handleChange(array, 'savedMessages');
              }}
            />

            <View style={tw` w-full flex-col justify-center items-center`}>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  marginTop: 10,
                }}
              >
                <CheckBox
                  value={showUrgentMessage}
                  onValueChange={(value) => {
                    handleChange(value, 'showUrgentMessage'); 
                  }}
                  style={{ alignSelf: 'center' }}
                />
                <Text style={tw`ml-2`}>Show Urgent Message</Text>
              </View>
            </View>
           
          </View>
        </View>
      </Layout>
    </View>
  
};

export default CompetitionScreen;
