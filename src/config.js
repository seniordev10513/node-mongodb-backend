const config = {};
config.mongoUrl = 'mongodb://tajawal:tajawal2021@cluster0-shard-00-00.6tt4u.mongodb.net:27017,cluster0-shard-00-01.6tt4u.mongodb.net:27017,cluster0-shard-00-02.6tt4u.mongodb.net:27017/tajawal?ssl=true&replicaSet=atlas-8y4ogu-shard-0&authSource=admin&w=majority';
// config.mongoUrl =  'mongodb://127.0.0.1:27017/mjawesh'
//config.mongoUrl = 'mongodb+srv://doadmin:<replace-with-your-password>@private-dbaas-db-101735-9cde5961.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=dbaas-db-101735&tls=true&tlsCAFile=<replace-with-path-to-CA-cert>'
config.jwtSecret = 'Tajawal';
config.confirmMessage = 'verify code: ';
config.App = {Name:'Tajawal'}
config.GoogleApiKey = 'AIzaSyAopqrgTVP86bnQposmo5dYB3jidriBvJM';
config.twilioAccountSID = 'ACe094aaa08a1e538b9e8be6cc271507ce';
config.twilioAuthToken = '9fd6e916cf11e11eed07042ec167d5f8';
config.twilioServiceSID = 'VAa1a5df1ce7d23f925f2b2f8a63f4b755';
config.backend_endpoint = 'https://www.catchit.sa/Tajawal-Backend';
config.countryCode = '+966'


config.notificationTitle = {
    ar:'Tajawal',
    en: 'Tajawal'
}

config.payment = {
    //////////////////////////test////////////////////////////////
    // access_token : 'Bearer OGFjN2E0Yzk3NzJiNThhNjAxNzczODUyMWExZTBmMjV8NVlBRnA0V0dteg==',
    // Entity_ID_Card: '8ac7a4c9772b58a60177385297290f2a',
    // Entity_ID_Mada: '8ac7a4c9772b58a601773852f9a70f2e',
    // host: 'test.oppwa.com',
    /////////////////////////live////////////////////////////////
    access_token : 'Bearer OGFjZGE0Yzg3N2Q0YTA4MzAxNzdkOGFhYWQ1ODIzMzN8Q1NmM3dCRGVCOQ==',
    Entity_ID_Card: '8acda4c877d4a0830177d8abc15f233e',
    Entity_ID_Mada: '8acda4c877d4a0830177d8ad3d4b2355',
    host: 'oppwa.com' ,
    Currency: 'SAR',
    PaymentType: 'DB',
    testMode:'EXTERNAL',
    notificationUrl : 'https://www.catchit.sa/Catchit-Backend/payment/notify',
}


///////Twiliio/////////////
//username == octateamsolution@gmail.com
//password == Octateam2020##
export default config;
