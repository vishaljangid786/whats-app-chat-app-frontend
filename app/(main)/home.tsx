import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors } from '@/constants/theme'
import Button from '@/components/Button'
import { useAuth } from '@/context/authContext'

const home = () => {
  const {user,signOut} = useAuth()


  const handleLogout =async()=>{
    await signOut()
  }

  return (
    <ScreenWrapper>
      <Typo color={colors.white}>home</Typo>

      <Button onPress={handleLogout}>
        <Typo>
          Log Out
        </Typo>
      </Button>
    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({})