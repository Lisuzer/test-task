import { Controller, Get, Post, UseGuards, Body, Req, UseFilters, Query, ParseBoolPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserInfo } from "./types/info.dto";
import { SignInUserDto } from "./dto/signin.dto";
import { SignUpUserDto } from "./dto/signup.dto";
import { Tokens } from "./types/tokens.type";
import { RtGuard } from "./guards/rt.guard";
import { JwtGuard } from "./guards";
import { AllExceptionsFilter } from "src/common/excaption.filter";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiCreatedResponse({
        description: 'Model found'
    })
    @ApiBadRequestResponse({
        description: 'Invalid credentials'
    })
    @ApiOperation({
        description: 'Signin user in system | Required status: **Guest**',
    })
    @UseFilters(AllExceptionsFilter)
    @Post('signin')
    signIn(@Body() dto: SignInUserDto): Promise<Tokens> {
        return this.authService.signIn(dto);
    }

    @ApiCreatedResponse({
        description: 'Successfully created model'
    })
    @ApiBadRequestResponse({
        description: 'Invalid payload provided'
    })
    @ApiInternalServerErrorResponse({
        description: 'Error while creating model'
    })
    @ApiOperation({
        description: 'Signup user in system | Required roles: **Guest**',
    })
    @UseFilters(AllExceptionsFilter)
    @Post('signup')
    signUp(@Body() dto: SignUpUserDto): Promise<Tokens> {
        return this.authService.signUp(dto);
    }

    @ApiOkResponse({
        description: 'Getting user information'
    })
    @ApiUnauthorizedResponse({
        description: 'User unauthorized'
    })
    @ApiOperation({
        description: 'Getting user information | Required conditions: **Authorized**',
    })
    @UseFilters(AllExceptionsFilter)
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtGuard)
    @Get('info')
    info(@Req() req: any): Promise<UserInfo> {
        return this.authService.info(req);
    }


    @ApiOkResponse({
        description: 'Token was removed'
    })
    @ApiUnauthorizedResponse({
        description: 'User unauthorized'
    })
    @ApiOperation({
        description: 'Remove user refresh token | Required conditions: **Authorized**',
    })
    @ApiQuery({
        name: 'all',
        type: 'boolean',
        required: true,
    })
    @UseFilters(AllExceptionsFilter)
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtGuard)
    @Get('logout')
    logout(@Query('all', ParseBoolPipe) param: boolean, @Req() req: any): Promise<string> {
        return this.authService.logout(req, param);
    }

    @ApiCreatedResponse({
        description: 'Token was refreshed'
    })
    @ApiUnauthorizedResponse({
        description: 'User unauthorized'
    })
    @ApiOperation({
        description: 'Refresh user acess token | Required conditions: **Authorized**',
    })
    @UseFilters(AllExceptionsFilter)
    @ApiBearerAuth('JWT-auth')
    @UseGuards(RtGuard)
    @Post('refresh')
    refresh(@Req() req: any): Promise<Tokens> {
        return this.authService.refreshToken(req);
    }

}