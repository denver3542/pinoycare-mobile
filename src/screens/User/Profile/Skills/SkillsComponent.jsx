import React from 'react';
import { Chip, Text, StyleSheet } from 'react-native';

const SkillsChip = React.memo(({ skill, onRemoveSkill }) => (
    <Chip
        compact
        mode="outlined"
        onPress={() => { }}
        onClose={() => onRemoveSkill(skill.skill_name)}
        style={styles.chip}
    >
        <Text style={styles.smallFont}>{skill.skill_name}</Text>
    </Chip>
));

const styles = StyleSheet.create({
    chip: {
        margin: 4,
        borderRadius: 20,
    },
    smallFont: {
        fontSize: 10,
    },
});

export default SkillsChip;
