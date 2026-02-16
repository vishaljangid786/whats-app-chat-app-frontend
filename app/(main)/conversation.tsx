import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'

const conversation = () => {
  return (
    <ScreenWrapper>
      <Typo color={colors.white}>conversation</Typo>
    </ScreenWrapper>
  )
}

export default conversation

const styles = StyleSheet.create({})