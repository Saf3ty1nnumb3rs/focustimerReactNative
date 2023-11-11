import { useCallback, useState } from 'react';
import { View, StyleSheet, Text, Vibration } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useKeepAwake } from 'expo-keep-awake';
import { Countdown } from '../components/Countdown';
import { RoundedButton } from '../components/RoundedButton';
import { Timing } from './Timing';
import { spacing } from '../utils/sizes';
import { colors } from '../utils/colors';

const ONE_SECOND_IN_MS = 1000;

const PATTERN = [
  1 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
  1 * ONE_SECOND_IN_MS,
];
export const Timer = ({ clearSubject, focusSubject, onTimerEnd }) => {
  useKeepAwake();
  const [isPaused, setIsPaused] = useState(true);
  const [progress, setProgress] = useState(1);
  const [minutes, setMinutes] = useState(0.1);

  const onEnd = useCallback((reset) => {
    Vibration.vibrate(PATTERN); // different pattern on iOS vs Android
    setIsPaused(true);
    setProgress(1);
    reset();
    onTimerEnd(focusSubject);
  }, [focusSubject, onTimerEnd]);

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          isPaused={isPaused}
          minutes={minutes}
          onProgress={setProgress}
          onEnd={onEnd}
        />
        <View style={{ paddingTop: spacing.xxl }}>
          <Text style={styles.title}>Focusing on:</Text>
          <Text style={styles.task}>{focusSubject}</Text>
        </View>
      </View>
      <View>
        <ProgressBar
          progress={progress}
          color={colors.progressBar}
          style={{ height: spacing.sm }}
        />
      </View>
      <View style={styles.timingWrapper}>
        <Timing title="start" onChangeTime={setMinutes} />
      </View>
      <View style={styles.adjustMinutesButtons}>
        <RoundedButton size={50} title="-" onPress={() => setMinutes(minutes - 1)} />
        <RoundedButton size={50} title="+" onPress={() => setMinutes(minutes + 1)} />
      </View>
      <View style={styles.buttonWrapper}>
        {isPaused ? (
          <RoundedButton title="start" onPress={() => setIsPaused(false)} />
        ) : (
          <RoundedButton title="pause" onPress={() => setIsPaused(true)} />
        )}
      </View>
      <View style={styles.clearSubjectWrapper}>
        <RoundedButton size={50} title="X" onPress={clearSubject} style={styles.clearSubjectButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  adjustMinutesButtons: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  buttonWrapper: {
    flex: 0.3,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSubjectButton : {
    backgroundColor: 'red',
  },
  clearSubjectWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  countdown: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  task: {
    color: colors.white,
    textAlign: 'center',
  },
  timingWrapper: {
    flex: 0.1,
    flexDirection: 'row',
    paddingTop: spacing.xxl,
  },
  title: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
