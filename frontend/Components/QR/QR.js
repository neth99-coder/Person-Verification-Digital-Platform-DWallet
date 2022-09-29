import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import useERC20Balance from "../../hooks/useERC20balance";
import {
    StyleSheet,
    View,
    StatusBar,
    SafeAreaView,
    ScrollView,
    Text,
} from "react-native";


export default function QR() {
    const { Moralis } = useMoralis();
    // const nativeName = useMemo(() => getNativeByChain(options?.chain || chainId), [options, chainId]);
    return (
        <SafeAreaView style={[StyleSheet.absoluteFill, styles.container]}>
            <ScrollView>
                <View style={styles.viewContainer}>
                    <Text style={styles.headerText} category="h4">
                        Scan QR
                    </Text>


                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "white",
    },
    chainText: {
        fontSize: 15,
        color: "#414a4c",
        paddingTop: 20,
        paddingHorizontal: 5,
        fontWeight: "600",
    },
    headerText: {
        color: "black",
        fontWeight: "600",
        fontSize: 35,
    },
    viewContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        flex: 10,
    },
});
