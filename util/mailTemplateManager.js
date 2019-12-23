/* eslint-disable max-len */
const templateList = {
    verificationEmail: {
        subject: `Mail verification link for ${process.env.APP_NAME}`,
        text: '',
        html: `<table>
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            Please confirm your email address by clicking the link below.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            We may need to send you critical information about our service and it is important that we have an accurate email address.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <a href='<%link%>' ><button style="{background-color:'green'}">Confirm email address</button></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            — The ${process.env.APP_NAME}
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`,
    },
    resetPasswordByLink: {
        subject: `Link to reset your account password for ${process.env.APP_NAME}`,
        text: '',
        html: `<table>
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            Reset password
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            We may need to send you critical information about our service and it is important that we have an accurate email address.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <a href='<%link%>' ><button style="{background-color:'green'}">Confirm email address</button></a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            — The ${process.env.APP_NAME}
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`,
    },
    resetPasswordByCode: {
        subject: `Code to reset your account password for ${process.env.APP_NAME}`,
        text: '',
        html: `<table>
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            Reset password
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            We may need to send you critical information about our service and it is important that we have an accurate email address.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <button style="background-color: green; color: white"><%code%></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            — The ${process.env.APP_NAME}
                                        </td>
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`,
    },
    newUserMessage: {
        subject: `new member in ${process.env.APP_NAME} community`,
        text: '',
        html: `<table>
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <%title%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a href="<%url%>"><img src="<%image%>"/><a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <a href='<%profil%>'><button style="background-color: green; color: white">Profil</button>
                                            </a>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="content-block">
                                            — The ${process.env.APP_NAME}
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`,
    },
    welcomeToNewUser: {
        subject: 'Welcome',
        text: '',
        html: `<table>
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <%title%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
                                   
                                    <tr>
                                        <td class="content-block">
                                            — The ${process.env.APP_NAME}
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`,
    },
    profilPictureChange: {
        subject: '<%userName%> update him profil picture',
        text: '',
        html: `<table>
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <%title%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a href="<%url%>"><img src="<%image%>"/><a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <a href='<%profil%>'><button style="background-color: green; color: white">Profil</button>
                                            </a>
                                        </td>
                                    </tr>
                                    
                                    <tr>
                                        <td class="content-block">
                                            — The ${process.env.APP_NAME}
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                    <div class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`,
    },
    anonymeMessage: {
        subject: '<%userName%> ',
        text: '',
        html: `<table>
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                            <%title%>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
            
                                    
                                    <tr>
                                        <td class="content-block">
                                            — The <%email%>
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                   </div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`,
    },
    activity: {
        subject: '',
        text: '',
        html: `<table>
        <tbody><tr>
            <td></td>
            <td class="container" width="600">
                <div class="content">
                    <table class="main" width="100%" cellpadding="0" cellspacing="0">
                        <tbody><tr>
                            <td class="content-wrap">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tbody><tr>
                                        <td class="content-block">
                                           <a href="<%url%>"> <%title%> </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="content-block">
                                            <%description%>
                                        </td>
                                    </tr>
            
                                    
                                    <tr>
                                        <td class="content-block">
                                            — The ${process.env.APP_NAME}
                                        </td>
                                        
                                    </tr>
                                </tbody></table>
                            </td>
                        </tr>
                    </tbody></table>
                   </div>
                   <div class="footer">
                        <table width="100%">
                            <tbody><tr>
                            <td class="aligncenter content-block">Follow <a href="${process.env.twitter}">${process.env.twitter_name}</a> on Twitter, <a href="${process.env.fb}">Facebook</a> and <a href="${process.env.instagram}">Instagram</a>.<a href="${process.env.BASE_URL}">Home</a></td>
                         </tr>
                        </tbody></table>
                    </div></div>
            </td>
            <td></td>
        </tr>
    </tbody></table>`,
    },
};


module.exports.getTemplate = name => templateList[name];
