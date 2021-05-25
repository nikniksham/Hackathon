from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField,  BooleanField, PasswordField
from wtforms.validators import DataRequired


class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired()])
    password = StringField("Password", validators=[DataRequired()])
    submit = SubmitField("Submit", validators=None)


class RegisterForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired()])
    nickname = StringField("Nickname", validators=[DataRequired()])
    submit = SubmitField("Submit", validators=None)


class JoinForm(FlaskForm):
    game_code = StringField("Game Code", validators=[DataRequired()])
    submit = SubmitField("Submit", validators=None)
