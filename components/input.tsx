import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { InputProps } from '@/types'
import { colors, radius, spacingX } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import * as Icons from 'phosphor-react-native' // adjust according to your project

const Input = (props: InputProps & { isPassword?: boolean; isEmail?: boolean }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [secure, setSecure] = useState(!!props.isPassword)

  const handleChangeText = (text: string) => {
    const formattedText = props.isEmail ? text.toLowerCase() : text
    props.onChangeText && props.onChangeText(formattedText)
  }

  return (
    <View
      style={[
        styles.container,
        props.containerStyle,
        isFocused && styles.primaryBorder
      ]}
    >
      {props.icon && props.icon}

      <TextInput
        {...props}
        style={[styles.input, props.inputStyle]}
        placeholderTextColor={colors.neutral400}
        secureTextEntry={secure}
        value={props.isEmail && props.value ? props.value.toLowerCase() : props.value}
        autoCapitalize={props.isEmail ? 'none' : 'sentences'}
        autoCorrect={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={handleChangeText}
      />

      {props.isPassword && (
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          {secure ? (
            <Icons.EyeClosed size={verticalScale(22)} color={colors.neutral600} />
          ) : (
            <Icons.Eye size={verticalScale(22)} color={colors.neutral600} />
          )}
        </TouchableOpacity>
      )}
    </View>
  )
}


export default Input

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        height:verticalScale(56),
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
        borderColor:colors.neutral200,
        borderRadius:radius.full,
        borderCurve:'continuous',
        paddingHorizontal:spacingX._15,
        backgroundColor:colors.neutral100,
        gap:spacingX._10
    },
    primaryBorder:{
        borderColor:colors.primary
    },
    input:{
        flex:1,
        color:colors.text,
        fontSize:verticalScale(14)
    }
})