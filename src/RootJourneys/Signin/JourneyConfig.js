
//

let journeyCompositionSky  = {
    signup : ["details", "emailverification", "invite"],
    signin : ["authn", "tcs"]
    // signin : ["authn"]
};





let sky =  {
    stylesheet : "sky.css",
    journeyComposition : journeyCompositionSky
};



export {sky};







// class nowtv {
//     stylesheet = "nowtv.css",
//     rootJourneys = ["signin"]
//     journeyComposition = journeyCompositionNowTV()
// }
//
// class nbcu {
//     stylesheet = "nbcu.css",
//     rootJourneys = ["signin"]
//     journeyComposition = journeyCompositionNBCU()
// }

//
// class SignUpFields {
//     email = true
//     password = true
//     firstname = true
//     tcs = true
// }
//
// class FieldsNowTV extends Fields {
//     email = true
//     password = true
//     firstname = true
//     tcs = true
// }
//
//
// class JourneyCompositionNowTV extends JourneyComposition {
// }
//
// class JourneyCompositionNBCU extends JourneyComposition {
//     signup = [details, emailverification]
//     signin = [authentication, emailverification]
// }

// class JourneyComposition {
//     signup = [details]
//     signin = [authentication]
// }














