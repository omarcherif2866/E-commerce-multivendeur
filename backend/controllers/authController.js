import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User  from "../models/user.js";
import Role  from "../models/role.js"; // Import the User and Role models
const jwtsecret = "mysecret";

const generateHashedPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const signup = async (req, res) => {
  const { username, email, password, roles } = req.body;
  console.log('Received role:', roles);
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.statusCompte === 'bloqué') {
        return res.status(409).json({ message: 'Account is blocked. Contact administrator for assistance.' });
      }
      return res.status(409).json({ message: 'User already exists' });
    }

    // Recherche du rôle par ID
    const selectedRole = await Role.findById(roles);
    if (!selectedRole) {
      return res.status(400).json({ message: 'Invalid role ID' });
    }
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      roles: selectedRole._id, // Assignez le rôle ici
      image:  imageFile.path,
    });
    user.statusUser = 'nonConfirmé';
    user.statusCompte = 'actif';


    await user.save();

    // Envoyer l'e-mail de confirmation à l'administrateur
    // const transporter = nodemailer.createTransport({
    //   // Configuration du service d'envoi d'e-mails (par exemple, Gmail)
    //   service: 'gmail',
    //   auth: {
    //     user: 'comar2866@gmail.com',
    //     pass: process.env.pass,
    //   },
    // });

    // const mailOptions = {
    //   from: 'comar2866@gmail.com',
    //   to: 'comar2866@gmail.com',
    //   subject: 'New User Registration',
    //   html: `
    //     <p>Hello Admin,</p>
    //     <p>A new user has registered:</p>
    //     <p>Username: ${username}</p>
    //     <p>Email: ${email}</p>
    //     <p>Please confirm the user registration by clicking on the following link:</p>
    //     <p>http://localhost:9090/user/confirm-user/${user._id}</p>
    //   `,
    // };

    // console.log("Sending confirmation email");
    // const info = await transporter.sendMail(mailOptions);
    // console.log('Email sent: ' + info.response);

    res.json({ message: 'User registration successful. Confirmation email sent to admin.' });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: 'Error registering user' });

  }
};

const getUser = async (req, res, next) => {

    try {
    const cookie = req.cookies['jwt'];
    const claims = jwt.verify(cookie, 'secret');
    if (!claims) {
        return res.status(401).json({message: "utilisateur non connecte"})
    }
    const userr = await User.findOne({where: {id: claims.id}});
    const {password, ...data} = await userr.toJSON();
    res.send(data);
}catch(err){
    return res.status(401).json({message: "utilisateur non connecte"})
}
next
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!process.env.jwt_Secret) {
      return res.status(500).json({ message: 'JWT secret key is missing' });
    }

    const user = await User.findOne({ email }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    if (user.statusCompte == "bloqué") {
      return res.status(401).send({ message: "Account is blocked." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.jwt_Secret, {
      expiresIn: 31557600, // 24 hours
    });

    const roleName = user.roles.name;

    req.session.token = token;

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      roles: roleName, // Utilisez le nom du rôle unique
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error signing in' });
  }
};

const signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error signing out' });
  }
};

export function getUserById(req, res) {
  const userId = req.params.id;

  User.findById(userId)
    .then((doc) => {
      if (!doc) {
        // Gérer le cas où l'utilisateur n'est pas trouvé
        res.status(404).json({ message: 'Utilisateur non trouvé' });
      } else {
        res.status(200).json(doc);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export async function updateUserProfile(req, res) {
  try {
    const { username, email } = req.body;

    let profile = { username, email };

    if (req.file) {
      console.log('File received:', req.file);

      profile.image = `${req.file.filename}`; // Assurez-vous que le chemin est correct
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, profile, { new: true });

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil utilisateur' });
  }
}

const putPassword = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { password, newpassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        status: "error",
        message: "Current password is not valid",
      });
    }

    // Hash the new password
    const hashPassword = await bcrypt.hash(newpassword, 10);

    // Update the user's password
    await User.findByIdAndUpdate(userId, { password: hashPassword });

    return res.json({
      status: "success",
      message: "Password updated",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};








const getforgotPassword = async (req, res) => {
  try {
    res.render("forget-password"); // Utilisez res.render pour rendre la vue
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Une erreur s'est produite lors du rendu de la page" });
  }
};

const postforgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Vérifier si l'email existe dans la base de données
    const user = await User.findOne({ email  });
    if (!user) {
      // Si l'utilisateur n'existe pas, renvoyer une réponse avec un message d'erreur
      return res.status(404).json({ message: "Email n'existe pas" });
    }

    // Si l'utilisateur existe, générer le token et le lien de réinitialisation du mot de passe
    const secret = jwtsecret + user.password;
    const payload = {
      email: user.email,
      id: user.id,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "30min" });
    const link = `http://localhost:3000/auth/resetpassword/${user.id}/${token}`;

    // Envoyer un email avec le lien de réinitialisation du mot de passe
    sendMail(email, link, user.username);

    // Renvoyer une réponse indiquant que l'email a été envoyé avec succès
    return res.status(200).json({ message: "Email envoyé avec succès" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Une erreur s'est produite lors du traitement de la demande" });
  }
};



async function sendMail(email , link, username) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "comar2866@gmail.com", // generated ethereal user
      pass: "montaha1234??",
    }
  });

  let mailOptions = {
    from: 'TOP IN TECK', // sender address
    to: email, // list of receivers
    subject: "mot de passe oublié 👻" , // Subject line 👻", // Subject line
    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <title></title>
        <style type="text/css" rel="stylesheet" media="all">
        /* Base ------------------------------ */
        
        @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
        body {
          width: 100% !important;
          height: 100%;
          margin: 0;
          -webkit-text-size-adjust: none;
        }
        
        a {
          color: #3869D4;
        }
        
        a img {
          border: none;
        }
        
        td {
          word-break: break-word;
        }
        
        .preheader {
          display: none !important;
          visibility: hidden;
          mso-hide: all;
          font-size: 1px;
          line-height: 1px;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
        }
        /* Type ------------------------------ */
        
        body,
        td,
        th {
          font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
        }
        
        h1 {
          margin-top: 0;
          color: #333333;
          font-size: 22px;
          font-weight: bold;
          text-align: left;
        }
        
        h2 {
          margin-top: 0;
          color: #333333;
          font-size: 16px;
          font-weight: bold;
          text-align: left;
        }
        
        h3 {
          margin-top: 0;
          color: #333333;
          font-size: 14px;
          font-weight: bold;
          text-align: left;
        }
        
        td,
        th {
          font-size: 16px;
        }
        
        p,
        ul,
        ol,
        blockquote {
          margin: .4em 0 1.1875em;
          font-size: 16px;
          line-height: 1.625;
        }
        
        p.sub {
          font-size: 13px;
        }
        /* Utilities ------------------------------ */
        
        .align-right {
          text-align: right;
        }
        
        .align-left {
          text-align: left;
        }
        
        .align-center {
          text-align: center;
        }
        
        .u-margin-bottom-none {
          margin-bottom: 0;
        }
        /* Buttons ------------------------------ */
        
        .button {
          background-color: #3869D4;
          border-top: 10px solid #3869D4;
          border-right: 18px solid #3869D4;
          border-bottom: 10px solid #3869D4;
          border-left: 18px solid #3869D4;
          display: inline-block;
          color: #FFF;
          text-decoration: none;
          border-radius: 3px;
          box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
          -webkit-text-size-adjust: none;
          box-sizing: border-box;
        }
        
        .button--green {
          background-color: #22BC66;
          border-top: 10px solid #22BC66;
          border-right: 18px solid #22BC66;
          border-bottom: 10px solid #22BC66;
          border-left: 18px solid #22BC66;
        }
        
        .button--red {
          background-color: #FF6136;
          border-top: 10px solid #FF6136;
          border-right: 18px solid #FF6136;
          border-bottom: 10px solid #FF6136;
          border-left: 18px solid #FF6136;
        }
        
        @media only screen and (max-width: 500px) {
          .button {
            width: 100% !important;
            text-align: center !important;
          }
        }
        /* Attribute list ------------------------------ */
        
        .attributes {
          margin: 0 0 21px;
        }
        
        .attributes_content {
          background-color: #F4F4F7;
          padding: 16px;
        }
        
        .attributes_item {
          padding: 0;
        }
        /* Related Items ------------------------------ */
        
        .related {
          width: 100%;
          margin: 0;
          padding: 25px 0 0 0;
          -premailer-width: 100%;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
        }
        
        .related_item {
          padding: 10px 0;
          color: #CBCCCF;
          font-size: 15px;
          line-height: 18px;
        }
        
        .related_item-title {
          display: block;
          margin: .5em 0 0;
        }
        
        .related_item-thumb {
          display: block;
          padding-bottom: 10px;
        }
        
        .related_heading {
          border-top: 1px solid #CBCCCF;
          text-align: center;
          padding: 25px 0 10px;
        }
        /* Discount Code ------------------------------ */
        
        .discount {
          width: 100%;
          margin: 0;
          padding: 24px;
          -premailer-width: 100%;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
          background-color: #F4F4F7;
          border: 2px dashed #CBCCCF;
        }
        
        .discount_heading {
          text-align: center;
        }
        
        .discount_body {
          text-align: center;
          font-size: 15px;
        }
        /* Social Icons ------------------------------ */
        
        .social {
          width: auto;
        }
        
        .social td {
          padding: 0;
          width: auto;
        }
        
        .social_icon {
          height: 20px;
          margin: 0 8px 10px 8px;
          padding: 0;
        }
        /* Data table ------------------------------ */
        
        .purchase {
          width: 100%;
          margin: 0;
          padding: 35px 0;
          -premailer-width: 100%;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
        }
        
        .purchase_content {
          width: 100%;
          margin: 0;
          padding: 25px 0 0 0;
          -premailer-width: 100%;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
        }
        
        .purchase_item {
          padding: 10px 0;
          color: #51545E;
          font-size: 15px;
          line-height: 18px;
        }
        
        .purchase_heading {
          padding-bottom: 8px;
          border-bottom: 1px solid #EAEAEC;
        }
        
        .purchase_heading p {
          margin: 0;
          color: #85878E;
          font-size: 12px;
        }
        
        .purchase_footer {
          padding-top: 15px;
          border-top: 1px solid #EAEAEC;
        }
        
        .purchase_total {
          margin: 0;
          text-align: right;
          font-weight: bold;
          color: #333333;
        }
        
        .purchase_total--label {
          padding: 0 15px 0 0;
        }
        
        body {
          background-color: #F2F4F6;
          color: #51545E;
        }
        
        p {
          color: #51545E;
        }
        
        .email-wrapper {
          width: 100%;
          margin: 0;
          padding: 0;
          -premailer-width: 100%;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
          background-color: #F2F4F6;
        }
        
        .email-content {
          width: 100%;
          margin: 0;
          padding: 0;
          -premailer-width: 100%;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
        }
        /* Masthead ----------------------- */
        
        .email-masthead {
          padding: 25px 0;
          text-align: center;
        }
        
        .email-masthead_logo {
          width: 94px;
        }
        
        .email-masthead_name {
          font-size: 16px;
          font-weight: bold;
          color: #A8AAAF;
          text-decoration: none;
          text-shadow: 0 1px 0 white;
        }
        /* Body ------------------------------ */
        
        .email-body {
          width: 100%;
          margin: 0;
          padding: 0;
          -premailer-width: 100%;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
        }
        
        .email-body_inner {
          width: 570px;
          margin: 0 auto;
          padding: 0;
          -premailer-width: 570px;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
          background-color: #FFFFFF;
        }
        
        .email-footer {
          width: 570px;
          margin: 0 auto;
          padding: 0;
          -premailer-width: 570px;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
          text-align: center;
        }
        
        .email-footer p {
          color: #A8AAAF;
        }
        
        .body-action {
          width: 100%;
          margin: 30px auto;
          padding: 0;
          -premailer-width: 100%;
          -premailer-cellpadding: 0;
          -premailer-cellspacing: 0;
          text-align: center;
        }
        
        .body-sub {
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid #EAEAEC;
        }
        
        .content-cell {
          padding: 45px;
        }
        /*Media Queries ------------------------------ */
        
        @media only screen and (max-width: 600px) {
          .email-body_inner,
          .email-footer {
            width: 100% !important;
          }
        }
        
        @media (prefers-color-scheme: dark) {
          body,
          .email-body,
          .email-body_inner,
          .email-content,
          .email-wrapper,
          .email-masthead,
          .email-footer {
            background-color: #333333 !important;
            color: #FFF !important;
          }
          p,
          ul,
          ol,
          blockquote,
          h1,
          h2,
          h3,
          span,
          .purchase_item {
            color: #FFF !important;
          }
          .attributes_content,
          .discount {
            background-color: #222 !important;
          }
          .email-masthead_name {
            text-shadow: none !important;
          }
        }
        
        :root {
          color-scheme: light dark;
          supported-color-schemes: light dark;
        }
        </style>
        <!--[if mso]>
        <style type="text/css">
          .f-fallback  {
            font-family: Arial, sans-serif;
          }
        </style>
      <![endif]-->
      </head>
      <body>
        <span class="preheader">Use this link to reset your password. The link is only valid for 30 min </span>
        <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center">
              <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="email-masthead">
                    <a href="http://localhost:4200/accueil" class="f-fallback email-masthead_name">
                   Top in tech
                  </a>
                  </td>
                </tr>
                <!-- Email Body -->
                <tr>
                  <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                    <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                      <!-- Body content -->
                      <tr>
                        <td class="content-cell">
                          <div class="f-fallback">
                            <h1>salut ${username},</h1>
                            <p>Vous avez récemment demandé la réinitialisation de votre mot de passe pour votre compte top in tech. Utilisez le bouton ci-dessous pour le réinitialiser. <strong>Cette réinitialisation du mot de passe n'est valable que pour les 30 prochaines minutes.</strong></p>
                            <!-- Action -->
                            <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                                <td align="center">
                                  <!-- Border based button
               https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                                  <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                    <tr>
                                      <td align="center">
                                        <a href="${link}" class="f-fallback button button--green" target="_blank">Reset your password</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <p>Pour des raisons de sécurité, cette demande a été reçue d'un appareil {{operating_system}} utilisant {{browser_name}}. Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail ou <a href="{{support_url}}">contacter l'assistance</a> si vous avez des questions.</p>
                            <p>Merci,
                              <br>The top in tech team</p>
                            <!-- Sub copy -->
                            <table class="body-sub" role="presentation">
                              <tr>
                                <td>
                                  <p class="f-fallback sub">Si vous rencontrez des problèmes avec le bouton ci-dessus, copiez et collez l'URL ci-dessous dans votre navigateur Web.</p>
                                  <p class="f-fallback sub">{{action_url}}</p>
                                </td>
                              </tr>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="content-cell" align="center">
                          <p class="f-fallback sub align-center">
                            centre elif kef
                           
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });

}


const getresetPassword = async (req, res) => {
  const { id, token } = req.params;
  const User = await User.findOne({ where: { id } });
    if (!User) {
        return res.status(404).json({ message: "user not found" });
        }
    const secret = jwtsecret + User.password;
    try {
        const payload = jwt.verify(token, secret);
        res.render("reset-password" , {email:User.email , id:User.id , token:token});
    } catch (error) {
        res.status(400).json({ message: "invalid token" });
    }


};

const postresetPassword = async (req, res) => {
  const { id, token } = req.params;
    const { password1 , password2 } = req.body;
    const User = await User.findOne({ where: { id } });
    if (!User) {
        return res.status(404).json({ message: "user not found" });
        }


    if (password1 !== password2) {
        return res.status(400).json({ message: "password not match" });
        }
    const secret = jwtsecret + User.password;

    try {
        const payload = jwt.verify(token, secret);
        if ( payload.id === User.id) {
            const hash = await bcrypt.hash(password1, 10);
            await User.update({ password: hash });
            res.status(200).json({ message: "password updated" });
        } else {
            res.status(400).json({ message: "invalid token" });
        }
    } catch (error) {
        res.status(400).json({ message: "invalid token" });
    }
};


export { signup, signin, signout, getUser, putPassword  , getforgotPassword,
  postforgotPassword,
  getresetPassword,
  postresetPassword, };