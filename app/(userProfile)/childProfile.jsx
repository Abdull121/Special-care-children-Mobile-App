import { View, Text, SafeAreaView, ScrollView,  } from 'react-native'
import React, { useState } from 'react'
import FormFields from '../../components/FormFields';
import CustomButton from '../../components/CustomButton';
import { StatusBar } from 'expo-status-bar';
import { router } from "expo-router";

// import { Picker } from "@react-native-picker/picker";
import { Dropdown } from 'react-native-element-dropdown';
import service from '../../Appwrite/config';
import { useGlobalContext } from '../../context/GlobalProvider';


const childProfile = () => {
    const { setUser } = useGlobalContext();
    //console.log(user)
    const [form, setForm] = useState({
        childName: "",
        age: "",

    });
    const [selectedValue, setSelectedValue] = useState("");

    //console.log(selectedValue)

    const [isFocus, setIsFocus] = useState(false);
    const data = [
        { label: 'Autism', value: 'autism' },
        { label: 'ADHD', value: 'adhd' },
        { label: 'Down Syndrome', value: 'down_syndrome' },
        { label: 'Cerebral Palsy', value: 'cerebral_palsy' },
    ];

    const handelSubmit = async () => {
        console.log(form.age, form.childName);
        try{
            for (const item of data) {
                if (item.value === selectedValue) {
                  console.log(item.value);
                  const result = await service.createChildProfile({
                    childName: form.childName,
                    age: form.age,
                    primaryCondition: item.value,
                  });
                  if (result) {
                    console.log("Child profile created successfully");
                    setUser(result);
                    router.push("/home");
                  }
                  break; // Exit the loop once the matching item is found and processed
                }
              }
        }catch(error){
            console.log("Appwrite serive :: createChildeProfile :: error", error);
        }
        
      };

    return (
        <SafeAreaView className="bg-white" >
            <View className="h-full px-4 py-2 bg-white">
                <ScrollView contentContainerStyle={{ height: "100%" }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                //Disable horizontal scroll indicator
                >

                    <View className="w-full justify-center mt-6 min-h-[85vh]">
                        <Text className="font-heading text-primary text-[34px] mb-[35px] text-center">
                            SPECIAL CARE
                        </Text>
                        <View>
                            <Text className="font-psemibold text-[24px]">Tell us about your child</Text>
                            <Text className="font-pregular text-gary-Default">
                                This helps us personalize your experience
                            </Text>
                        </View>
                        <FormFields
                            title="Child Name"
                            placeholder="Enter your child name"
                            keyboardType="default"
                            secureTextEntry={false}
                            value={form.childName}
                            handleChangeText={(e) => setForm({ ...form, childName: e })}
                            otherStyle="mt-7"
                        />
                        <FormFields
                            title="Age"
                            placeholder="Enter your child age"
                            keyboardType="number-pad"
                            secureTextEntry={false}
                            value={form.age}
                            handleChangeText={(e) => setForm({ ...form, age: e })}
                            otherStyle="mt-7"
                        />

                        {/* Drop Down Field */}



                        <View className="mt-7">
                            <Text className="text-black-Default text-lg font-psemibold mb-2 text-[14px] line-hight-[24px]">
                                Primary Condition
                            </Text>
                            <Dropdown
                                style={{
                                    height: 48,
                                    borderColor: isFocus ? '#0166FC' : '#A4A6A6',
                                    borderWidth: 2,
                                    borderRadius: 4,
                                    paddingHorizontal: 8,
                                    justifyContent: 'center',
                                }}
                                placeholderStyle={{
                                    color: '#A4A6A6',
                                    fontSize: 14,
                                    fontFamily: 'Poppins-Regular', // Replace with your font
                                }}
                                selectedTextStyle={{
                                    color: '#000',
                                    fontSize: 14,
                                    fontFamily: 'Poppins-Regular', // Replace with your font
                                }}
                                data={data}
                                maxHeight={200}
                                labelField="label"
                                valueField="value"
                                placeholder={!isFocus ? 'Select Condition' : '...'}
                                value={selectedValue}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={(item) => {
                                    setSelectedValue(item.value);
                                    setIsFocus(false);
                                }}
                            />
                        </View>



                        <CustomButton
                            handlePress={handelSubmit}
                            title="Continue"
                            textStyles="text-center text-white text-[14px] font-psemibold "
                            container="mt-7 w-full h-12 rounded-[4px] bg-[#0166FC]"
                        />





                    </View>
                </ScrollView>

            </View>
            <StatusBar backgroundColor="transparent" style="dark" />
        </SafeAreaView>
    )
}

export default childProfile